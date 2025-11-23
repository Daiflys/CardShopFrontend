import React, { useState, useEffect, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { csvCardSearch } from '../../api/csvSearch';
import { bulkSellFromCSV } from '../../api/bulkSell';
import { conditionOptions } from '../../../utils/cardConditions';
import RarityCircle from '../../../components/RarityCircle';

interface CSVCard {
  setName: string;
  cardName: string;
  collectorNumber?: string;
  addToQuantity: number;
}

interface CardData {
  selected: boolean;
  condition: string;
  quantity: number;
  price: number;
  csvData: CSVCard | null;
  cardId: string | null;
  oracleId: string | null;
  notFound?: boolean;
}

interface CardToSell {
  quantity?: number;
}

interface MatchedCard {
  card: Card;
  cardsToSell?: CardToSell[];
}

interface RequestedCard {
  cardName: string;
  setName: string;
  collectorNumber?: string;
}

interface SearchResult {
  found: boolean;
  requestedCard: RequestedCard;
  matchedCards?: MatchedCard[];
  errorMessage?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

interface Card {
  id: string;
  oracleId?: string;
  name: string;
  setName?: string;
  setCode?: string;
  set?: string;
  imageUrl?: string;
  collectorNumber?: string;
  rarity?: string;
  reactKey?: string;
  csvQuantity?: number;
  currentQuantity?: number;
  requestedCard?: RequestedCard;
  found?: boolean;
  errorMessage?: string;
  language?: string;
}

interface HoveredCard {
  id: string;
  rect: DOMRect | null;
  imageUrl: string;
}

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedCSVData, setParsedCSVData] = useState<CSVCard[]>([]);
  const [cardData, setCardData] = useState<Record<string, CardData>>({});
  const [foundCards, setFoundCards] = useState<Card[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [hoveredCard, setHoveredCard] = useState<HoveredCard | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const parseExcelFile = (file: File): Promise<CSVCard[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          const cards = jsonData.map((row: any) => {
            const addToQty = row['Add to Quantity'] ||
                             row['Add to quantity'] ||
                             row['add to quantity'] ||
                             row['AddToQuantity'] ||
                             row['addtoquantity'] ||
                             row['Add To Quantity'] ||
                             0;

            const parsedCard: CSVCard = {
              setName: row['Set Name'] || row['Set name'] || row['set name'],
              cardName: row['Product Name'] || row['Product name'] || row['product name'],
              collectorNumber: row['Number'] ? String(row['Number']) : (row['number'] ? String(row['number']) : undefined),
              addToQuantity: parseInt(addToQty) || 0
            };

            console.log('Parsed CSV row:', parsedCard);
            return parsedCard;
          }).filter(card => card.cardName && card.setName);

          console.log('Total cards parsed from CSV:', cards.length);
          resolve(cards);
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setFoundCards([]);
    setCardData({});

    try {
      const cards = await parseExcelFile(file);

      if (cards.length === 0) {
        setError('No valid cards found in the file');
        setLoading(false);
        return;
      }

      setParsedCSVData(cards);
      const response: SearchResponse = await csvCardSearch(cards, language);

      if (response && response.results) {
        const cardsToDisplay: Card[] = [];
        const initialCardData: Record<string, CardData> = {};

        response.results.forEach((result, index) => {
          if (result.found && result.matchedCards && result.matchedCards.length > 0) {
            result.matchedCards.forEach((match, matchIndex) => {
              const card = match.card || {} as Card;

              console.log('=== Matching card ===');
              console.log('Requested card from server:', result.requestedCard);
              console.log('Looking in CSV for match...');

              const csvCard = cards.find(c => {
                const nameMatch = c.cardName === result.requestedCard.cardName;
                const setMatch = c.setName === result.requestedCard.setName;
                const numberMatch = !c.collectorNumber ||
                                    String(c.collectorNumber) === String(result.requestedCard.collectorNumber);

                console.log(`CSV card: ${c.cardName} | ${c.setName} | ${c.collectorNumber || 'no number'}`);
                console.log(`Matches: name=${nameMatch}, set=${setMatch}, number=${numberMatch}`);

                return nameMatch && setMatch && numberMatch;
              });

              const cardKey = `${card.id}_${index}_${matchIndex}`;
              const csvAddToQuantity = csvCard?.addToQuantity || 0;

              console.log('CSV card found:', csvCard);
              console.log('CSV Add to Quantity:', csvAddToQuantity);
              console.log('==================');

              const currentQuantity = match.cardsToSell
                ? match.cardsToSell.reduce((sum, cardToSell) => sum + (cardToSell.quantity || 0), 0)
                : 0;

              cardsToDisplay.push({
                ...card,
                reactKey: cardKey,
                csvQuantity: csvAddToQuantity,
                currentQuantity: currentQuantity,
                requestedCard: result.requestedCard,
                found: true,
                language: language
              });

              initialCardData[cardKey] = {
                selected: true,
                condition: 'NM',
                quantity: csvAddToQuantity,
                price: 0,
                csvData: csvCard || null,
                cardId: card.id,
                oracleId: card.oracleId || null
              };
            });
          } else {
            console.log('=== Not found card ===');
            console.log('Requested card from server:', result.requestedCard);

            const csvCard = cards.find(c =>
              c.cardName === result.requestedCard.cardName &&
              c.setName === result.requestedCard.setName &&
              (!c.collectorNumber || String(c.collectorNumber) === String(result.requestedCard.collectorNumber))
            );

            const cardKey = `notfound_${index}`;
            const csvAddToQuantity = csvCard?.addToQuantity || 0;

            console.log('CSV card found for not found:', csvCard);
            console.log('CSV Add to Quantity:', csvAddToQuantity);
            console.log('==================');

            cardsToDisplay.push({
              id: cardKey,
              reactKey: cardKey,
              name: result.requestedCard.cardName,
              setName: result.requestedCard.setName,
              collectorNumber: result.requestedCard.collectorNumber,
              csvQuantity: csvAddToQuantity,
              currentQuantity: 0,
              requestedCard: result.requestedCard,
              found: false,
              errorMessage: result.errorMessage || 'Card not found',
              language: language
            });

            initialCardData[cardKey] = {
              selected: false,
              condition: 'NM',
              quantity: csvAddToQuantity,
              price: 0,
              csvData: csvCard || null,
              cardId: null,
              oracleId: null,
              notFound: true
            };
          }
        });

        setFoundCards(cardsToDisplay);
        setCardData(initialCardData);
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred while processing the file');
    } finally {
      setLoading(false);
    }
  };

  const updateCardData = (cardKey: string, field: keyof CardData, value: any): void => {
    setCardData(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        [field]: value,
        selected: field === 'selected' ? value : true
      }
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const selectedCardEntries = Object.entries(cardData);
    const selectedCards = selectedCardEntries.filter(([cardKey, data]) =>
      data.selected && data.quantity > 0 && !data.notFound
    );

    if (selectedCards.length === 0) {
      setError('Please select at least one valid card with quantity > 0');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const cardsToSubmit = selectedCards.map(([cardKey, data]) => {
        const card = foundCards.find(c => c.reactKey === cardKey);
        return {
          cardId: data.cardId,
          oracleId: data.oracleId,
          setName: card?.setName || '',
          setCode: card?.setCode || '',
          cardName: card?.cardName || '',
          imageUrl: card?.imageUrl || '',
          price: parseFloat(String(data.price)),
          condition: data.condition,
          quantity: parseInt(String(data.quantity)),
          language: language
        };
      });

      const submitResult = await bulkSellFromCSV(cardsToSubmit, language);
      setSuccessMessage(`Successfully listed ${selectedCards.length} cards for sale!`);

      const clearedCardData: Record<string, CardData> = {};
      Object.keys(cardData).forEach(cardKey => {
        clearedCardData[cardKey] = {
          ...cardData[cardKey],
          selected: false,
          quantity: 0,
          price: 0
        };
      });
      setCardData(clearedCardData);

    } catch (err) {
      setError('Error submitting cards: ' + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = Object.values(cardData).filter(data => data.selected).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!(event.target as HTMLElement).closest('.card-hover')) {
        setHoveredCard(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Panel - Bulk Card Upload</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Upload CSV to Add Cards</h2>
            <p className="text-slate-600 mb-4">
              Upload a CSV or Excel file containing card information. The file should contain columns: Set Name, Product Name, Number, and Add to Quantity.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Spreadsheet File (CSV or Excel)
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {file && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="ru">Russian</option>
                <option value="zhs">Chinese Simplified</option>
                <option value="zht">Chinese Traditional</option>
              </select>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Upload and Search'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
            )}

            {foundCards.filter(c => c.found).length > 0 && (
              <div className="bg-white rounded-lg shadow mt-6">
                <div className="flex justify-between items-center p-4 border-b bg-green-50">
                  <div className="text-sm font-semibold text-green-800">
                    Found Cards ({foundCards.filter(c => c.found).length})
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-700 text-white">
                      <tr>
                        <th className="p-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const newCardData = { ...cardData };
                              foundCards.forEach(card => {
                                const cardKey = card.reactKey!;
                                if (card.found) {
                                  newCardData[cardKey] = {
                                    ...newCardData[cardKey],
                                    selected: e.target.checked
                                  };
                                }
                              });
                              setCardData(newCardData);
                            }}
                          />
                        </th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Set</th>
                        <th className="p-3 text-left">Language</th>
                        <th className="p-3 text-left">Rarity</th>
                        <th className="p-3 text-left">Condition</th>
                        <th className="p-3 text-left">CSV Qty</th>
                        <th className="p-3 text-left">Current Qty</th>
                        <th className="p-3 text-left">Amount to Add</th>
                        <th className="p-3 text-left">Total after Add</th>
                        <th className="p-3 text-left">Price (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foundCards.filter(c => c.found).map((card, index) => {
                        const cardKey = card.reactKey!;
                        const rowClass = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                        const currentQty = card.currentQuantity || 0;
                        const amountToAdd = cardData[cardKey]?.quantity || 0;
                        const totalAfterAdd = currentQty + amountToAdd;

                        return (
                          <tr key={cardKey} className={rowClass}>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={cardData[cardKey]?.selected || false}
                                onChange={(e) => updateCardData(cardKey, 'selected', e.target.checked)}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="relative card-hover"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setHoveredCard({ id: cardKey, rect, imageUrl: card.imageUrl || '' });
                                  }}
                                  onMouseLeave={() => setHoveredCard(null)}
                                >
                                  <svg
                                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </div>

                                {hoveredCard && hoveredCard.id === cardKey && hoveredCard.imageUrl && (
                                  <div
                                    className="fixed z-[9999] bg-white border rounded-lg shadow-2xl p-2 pointer-events-none"
                                    style={{
                                      left: hoveredCard.rect ? hoveredCard.rect.left - 320 - 8 : '100px',
                                      top: hoveredCard.rect ? hoveredCard.rect.bottom - 400 : '100px',
                                      width: '320px',
                                      maxHeight: '90vh',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <img
                                      src={hoveredCard.imageUrl}
                                      alt={card.cardName}
                                      className="w-full h-auto rounded max-h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                <span className="text-blue-600 hover:underline">
                                  {card.cardName}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{card.setName}</td>
                            <td className="p-3 text-sm text-center">{card.language?.toUpperCase() || 'EN'}</td>
                            <td className="p-3 text-center">
                              <RarityCircle rarity={card.rarity} size="medium" />
                            </td>
                            <td className="p-3">
                              <select
                                className="border rounded px-2 py-1"
                                value={cardData[cardKey]?.condition || 'NM'}
                                onChange={(e) => updateCardData(cardKey, 'condition', e.target.value)}
                              >
                                {conditionOptions.map(option => (
                                  <option key={option.code} value={option.code}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3 text-sm text-center">{card.csvQuantity}</td>
                            <td className="p-3 text-sm text-center">{currentQty}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                className="border rounded px-2 py-1 w-16"
                                value={cardData[cardKey]?.quantity || 0}
                                onChange={(e) => updateCardData(cardKey, 'quantity', parseInt(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-3 text-sm text-center font-semibold">{totalAfterAdd}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="border rounded px-2 py-1 w-20"
                                value={cardData[cardKey]?.price || ''}
                                onChange={(e) => updateCardData(cardKey, 'price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || selectedCount === 0}
                    className="w-full bg-blue-700 text-white py-3 px-6 rounded font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'SUBMITTING...' : `ADD CARD(S) TO INVENTORY (${selectedCount} selected)`}
                  </button>
                </div>
              </div>
            )}

            {foundCards.filter(c => !c.found).length > 0 && (
              <div className="bg-white rounded-lg shadow mt-6">
                <div className="flex justify-between items-center p-4 border-b bg-red-50">
                  <div className="text-sm font-semibold text-red-800">
                    Not Found Cards ({foundCards.filter(c => !c.found).length})
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-red-700 text-white">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Set</th>
                        <th className="p-3 text-left">Number</th>
                        <th className="p-3 text-left">Language</th>
                        <th className="p-3 text-left">CSV Qty</th>
                        <th className="p-3 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foundCards.filter(c => !c.found).map((card, index) => {
                        const rowClass = index % 2 === 0 ? 'bg-red-50' : 'bg-white';

                        return (
                          <tr key={card.reactKey} className={rowClass}>
                            <td className="p-3 text-sm font-medium text-red-900">{card.cardName}</td>
                            <td className="p-3 text-sm text-gray-700">{card.setName}</td>
                            <td className="p-3 text-sm text-gray-700">{card.collectorNumber || '-'}</td>
                            <td className="p-3 text-sm text-center">{card.language?.toUpperCase() || 'EN'}</td>
                            <td className="p-3 text-sm text-center">{card.csvQuantity}</td>
                            <td className="p-3 text-sm text-red-600">{card.errorMessage}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
