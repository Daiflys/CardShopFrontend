import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { csvCardSearch } from '../api/admin';

const Admin = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Extract card information
          // Based on the Excel structure: Set Name, Product Name (cardName), Number (collectorNumber)
          const cards = jsonData.map(row => ({
            setName: row['Set Name'] || row['Set name'] || row['set name'],
            cardName: row['Product Name'] || row['Product name'] || row['product name'],
            collectorNumber: row['Number'] || row['number'],
          })).filter(card => card.cardName && card.setName); // Filter out invalid rows

          resolve(cards);
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Parse the Excel file
      const cards = await parseExcelFile(file);

      if (cards.length === 0) {
        setError('No valid cards found in the file');
        setLoading(false);
        return;
      }

      // Send to backend using the new CSV search endpoint
      const response = await csvCardSearch(cards, language);

      setResults(response);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file');
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results || !results.results) return;

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Process results into found and not found cards
    const foundCards = [];
    const notFoundCards = [];

    results.results.forEach(result => {
      if (result.found && result.matchedCards && result.matchedCards.length > 0) {
        result.matchedCards.forEach(match => {
          const card = match.card || {};
          foundCards.push({
            'Card Name': result.requestedCard.cardName,
            'Set Name': result.requestedCard.setName,
            'Collector Number': result.requestedCard.collectorNumber,
            'Language': result.requestedCard.language,
            'Available': match.available ? 'Yes' : 'No',
            'Cards To Sell': match.cardsToSell ? match.cardsToSell.length : 0,
            'Card ID': card.id || '',
            'Scryfall ID': card.scryfallId || ''
          });
        });
      } else {
        notFoundCards.push({
          'Card Name': result.requestedCard.cardName,
          'Set Name': result.requestedCard.setName,
          'Collector Number': result.requestedCard.collectorNumber,
          'Language': result.requestedCard.language,
          'Error': result.errorMessage || 'Not found'
        });
      }
    });

    // Found cards sheet
    if (foundCards.length > 0) {
      const foundWs = XLSX.utils.json_to_sheet(foundCards);
      XLSX.utils.book_append_sheet(wb, foundWs, 'Found Cards');
    }

    // Not found cards sheet
    if (notFoundCards.length > 0) {
      const notFoundWs = XLSX.utils.json_to_sheet(notFoundCards);
      XLSX.utils.book_append_sheet(wb, notFoundWs, 'Not Found Cards');
    }

    // Download the file
    XLSX.writeFile(wb, `card-search-results-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Panel</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Bulk Card Search</h2>
            <p className="text-slate-600 mb-4">
              Upload a CSV or Excel file containing card information to search for cards in the database.
              The file should contain columns: Set Name, Product Name, and Number.
            </p>
          </div>

          <div className="space-y-6">
            {/* File Upload */}
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

            {/* Language Selection */}
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

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Upload and Search'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {results && results.results && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Results</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>Found: {results.results.filter(r => r.found).length} cards</p>
                    <p>Not Found: {results.results.filter(r => !r.found).length} cards</p>
                    <p>Total Processed: {results.results.length} cards</p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadResults}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Download Results
                </button>

                {/* Found Cards Table */}
                {(() => {
                  const foundResults = results.results.filter(r => r.found && r.matchedCards && r.matchedCards.length > 0);
                  return foundResults.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3">Found Cards</h3>
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Card Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Set</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Number</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Language</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Available</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cards To Sell</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {foundResults.slice(0, 100).map((result, index) =>
                              result.matchedCards.map((match, matchIndex) => (
                                <tr key={`${index}-${matchIndex}`} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 text-sm text-slate-900">{result.requestedCard.cardName}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.setName}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.collectorNumber}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.language}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">
                                    <span className={`px-2 py-1 rounded-full text-xs ${match.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {match.available ? 'Yes' : 'No'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{match.cardsToSell ? match.cardsToSell.length : 0}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        {foundResults.length > 100 && (
                          <div className="bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Showing 100 of {foundResults.length} cards. Download the file to see all results.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Not Found Cards Table */}
                {(() => {
                  const notFoundResults = results.results.filter(r => !r.found);
                  return notFoundResults.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3">Not Found Cards</h3>
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Card Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Set</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Number</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Language</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Error</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {notFoundResults.slice(0, 100).map((result, index) => (
                              <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-900">{result.requestedCard.cardName}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.setName}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.collectorNumber}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{result.requestedCard.language}</td>
                                <td className="px-4 py-3 text-sm text-red-600">{result.errorMessage || 'Not found'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {notFoundResults.length > 100 && (
                          <div className="bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Showing 100 of {notFoundResults.length} cards. Download the file to see all results.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
