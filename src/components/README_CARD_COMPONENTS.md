# Card Components Documentation

## Card Pricing Utilities

Centralized pricing logic extracted from Search.jsx to avoid code duplication.

### Functions

- `getLowestPrice(card)`: Gets the lowest available price for a card
- `getAvailableCount(card)`: Gets the available quantity for a card
- `createFormatPrice(t)`: Creates a price formatter function with localization

### Usage

```jsx
import { createFormatPrice, getAvailableCount } from '../utils/cardPricing';

const formatPrice = createFormatPrice(t);

<SearchGridCard
  card={card}
  formatPrice={formatPrice}
  getAvailableCount={getAvailableCount}
/>
```

## OtherVersions Component

Displays other versions of a card based on its Oracle ID. Automatically fetches and displays cards with the same Oracle ID but different printings/sets.

### Props

- `card` (Object): The current card object (must have oracleId or oracle_id)
- `currentCardId` (String): ID of the current card to filter out from results

### Features

- Automatic Oracle ID detection from card object
- Filters out the current card from results
- Show/hide functionality for large numbers of versions
- Responsive grid layout
- Error handling and loading states
- Internationalization support

### Usage

```jsx
import OtherVersions from './OtherVersions';

<OtherVersions
  card={cardData}
  currentCardId={cardData.id}
/>
```

## API Integration

### getCardsByOracleId

New API function added to `src/api/card.js` for fetching cards by Oracle ID with pagination support.

```javascript
export const getCardsByOracleId = realGetCardsByOracleId;
```

**Function signature:**
```javascript
realGetCardsByOracleId(oracleId, page = 1, size = 50)
```

**Makes a request to:** `GET /api/cards/oracleId/{id}?page={page}&size={size}`

**Returns:** Paginated response with structure:
```javascript
{
  content: [...], // Array of card objects
  totalElements: number,
  totalPages: number,
  // ... other pagination metadata
}
```

## Integration Points

### CardInfoTab

The OtherVersions component has been integrated into CardInfoTab.jsx between the card description section and the Recently Viewed section.

### Search Refactoring

The search functionality has been extracted into reusable components:
- Grid and list view logic moved to CardGrid component
- Maintains all existing functionality while enabling reuse
- Same visual design and user experience

## Internationalization Keys

Add these keys to your translation files:

```json
{
  "cardDetail": {
    "otherVersions": "Other Versions",
    "version": "version",
    "versions": "versions",
    "errorLoadingVersions": "Error loading other versions",
    "noOtherVersions": "No other versions found",
    "showMoreVersions": "Show {{count}} More Versions"
  },
  "common": {
    "showLess": "Show Less",
    "showAll": "Show All"
  }
}
```