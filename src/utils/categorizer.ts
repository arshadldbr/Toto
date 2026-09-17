import { Category, Transaction } from '../types';

export interface CategorySuggestion {
  categoryId: string;
  subcategoryId?: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

// Built-in keyword patterns mapped to categoryId and optional subcategoryId
const KEYWORD_RULES: Array<{
  keywords: string[];
  categoryId: string;
  subcategoryId?: string;
}> = [
  // Food & Dining
  {
    keywords: [
      'grocery', 'groceries', 'supermarket', 'vegetable', 'vegetables', 'fruit', 'fruits',
      'milk', 'bread', 'meat', 'chicken', 'egg', 'eggs', 'bazaar', 'mart', 'hypermarket',
      'imran store', 'carrefour', 'walmart', 'kroger', 'trader joe', 'costco', 'flour', 'rice',
      'oil', 'spices', 'snacks', 'biscuit', 'dairy'
    ],
    categoryId: 'food',
    subcategoryId: 'Groceries',
  },
  {
    keywords: [
      'restaurant', 'cafe', 'coffee', 'tea', 'chai', 'starbucks', 'dunkin', 'tim hortons',
      'diner', 'bistro', 'steak', 'bakery', 'takeout', 'delivery', 'breakfast', 'lunch',
      'dinner', 'fast food', 'mcdonald', 'kfc', 'burger', 'pizza', 'subway', 'domino',
      'foodpanda', 'doordash', 'ubereats', 'swiggy', 'zomato', 'shawarma', 'biryani', 'bbq'
    ],
    categoryId: 'food',
    subcategoryId: 'Restaurants',
  },

  // Transportation
  {
    keywords: [
      'petrol', 'fuel', 'gasoline', 'diesel', 'cng', 'shell', 'total', 'pso', 'chevron',
      'exxon', 'bp', 'gas station', 'petrol pump', 'refuel'
    ],
    categoryId: 'transport',
    subcategoryId: 'Fuel',
  },
  {
    keywords: [
      'uber', 'careem', 'lyft', 'taxi', 'cab', 'rickshaw', 'indrive', 'ride', 'fare', 'yango'
    ],
    categoryId: 'transport',
    subcategoryId: 'Taxi/Ride',
  },
  {
    keywords: [
      'bus', 'train', 'metro', 'subway fare', 'public transport', 'commute', 'tram', 'railway', 'ticket'
    ],
    categoryId: 'transport',
    subcategoryId: 'Public Transport',
  },
  {
    keywords: [
      'car maintenance', 'car wash', 'mechanic', 'oil change', 'puncture', 'tire', 'car repair',
      'vehicle service', 'tuning', 'motor'
    ],
    categoryId: 'transport',
    subcategoryId: 'Vehicle Maintenance',
  },
  {
    keywords: ['parking', 'toll', 'toll plaza', 'motorway tax'],
    categoryId: 'transport',
    subcategoryId: 'Parking',
  },

  // Health
  {
    keywords: [
      'doctor', 'physician', 'clinic', 'consultation', 'checkup', 'dentist', 'eye test',
      'opd', 'specialist', 'surgeon'
    ],
    categoryId: 'health',
    subcategoryId: 'Doctor',
  },
  {
    keywords: [
      'medicine', 'pharmacy', 'chemist', 'drugstore', 'pills', 'syrup', 'tablets',
      'prescription', 'panadol', 'walgreens', 'cvs', 'd-watson', 'servaid'
    ],
    categoryId: 'health',
    subcategoryId: 'Medicine',
  },
  {
    keywords: ['hospital', 'emergency', 'surgery', 'ward', 'admit', 'admission fee'],
    categoryId: 'health',
    subcategoryId: 'Hospital',
  },
  {
    keywords: ['lab', 'laboratory', 'blood test', 'xray', 'mri', 'ultrasound', 'medical test'],
    categoryId: 'health',
    subcategoryId: 'Medical Tests',
  },

  // Education
  {
    keywords: ['school fee', 'college fee', 'tuition', 'school', 'academy', 'tuition fee'],
    categoryId: 'education',
    subcategoryId: 'School/College',
  },
  {
    keywords: ['university', 'semester fee', 'uni fee', 'exam fee', 'campus'],
    categoryId: 'education',
    subcategoryId: 'University',
  },
  {
    keywords: ['course', 'udemy', 'coursera', 'training', 'bootcamp', 'certification'],
    categoryId: 'education',
    subcategoryId: 'Courses',
  },
  {
    keywords: ['book', 'books', 'stationery', 'notebook', 'pen', 'pencil', 'printouts', 'photocopy'],
    categoryId: 'education',
    subcategoryId: 'Books',
  },

  // Utilities
  {
    keywords: ['electricity bill', 'electric bill', 'power bill', 'lesco', 'kelectric', 'iesco', 'fesco', 'electricity'],
    categoryId: 'utilities',
    subcategoryId: 'Electricity',
  },
  {
    keywords: ['gas bill', 'sngpl', 'ssgc', 'natural gas', 'lpg', 'cylinder'],
    categoryId: 'utilities',
    subcategoryId: 'Gas',
  },
  {
    keywords: ['water bill', 'wasa', 'tanker', 'mineral water', 'water supply'],
    categoryId: 'utilities',
    subcategoryId: 'Water',
  },
  {
    keywords: ['internet', 'wifi', 'broadband', 'ptcl', 'nayatel', 'stormfiber', 'fiber', 'router'],
    categoryId: 'utilities',
    subcategoryId: 'Internet',
  },
  {
    keywords: ['mobile balance', 'recharge', 'jazz load', 'telenor load', 'zong load', 'ufone', 'phone bill', 'postpaid'],
    categoryId: 'utilities',
    subcategoryId: 'Mobile',
  },

  // Housing
  {
    keywords: ['rent', 'house rent', 'flat rent', 'apartment rent', 'landlord'],
    categoryId: 'housing',
    subcategoryId: 'Rent',
  },
  {
    keywords: ['plumber', 'electrician', 'home repair', 'paint', 'house maintenance'],
    categoryId: 'housing',
    subcategoryId: 'Maintenance',
  },
  {
    keywords: ['furniture', 'mattress', 'bed', 'sofa', 'table', 'curtains', 'bedsheet'],
    categoryId: 'housing',
    subcategoryId: 'Furniture',
  },

  // Entertainment
  {
    keywords: ['netflix', 'spotify', 'youtube premium', 'amazon prime', 'disney', 'hulu', 'streaming'],
    categoryId: 'entertainment',
    subcategoryId: 'Streaming',
  },
  {
    keywords: ['cinema', 'movie', 'imax', 'theatre', 'cinepax', 'nueplex'],
    categoryId: 'entertainment',
    subcategoryId: 'Movies',
  },
  {
    keywords: ['steam', 'playstation', 'xbox', 'game', 'gaming', 'nintendo'],
    categoryId: 'entertainment',
    subcategoryId: 'Games',
  },

  // Shopping
  {
    keywords: ['clothes', 'clothing', 'shirt', 'pants', 'shoes', 'outfit', 'dress', 'khaadi', 'sapphire', 'zara', 'h&m'],
    categoryId: 'shopping',
    subcategoryId: 'Clothing',
  },
  {
    keywords: ['electronics', 'gadget', 'laptop', 'smartphone', 'iphone', 'charger', 'headphones', 'daraz', 'amazon order'],
    categoryId: 'shopping',
    subcategoryId: 'Electronics',
  },

  // Income
  {
    keywords: ['salary', 'paycheck', 'payroll', 'wages', 'stipend', 'monthly pay'],
    categoryId: 'income_general',
    subcategoryId: 'Salary',
  },
  {
    keywords: ['freelance', 'client payment', 'upwork', 'fiverr', 'contract work', 'project payment'],
    categoryId: 'income_general',
    subcategoryId: 'Freelance',
  },
  {
    keywords: ['profit', 'business revenue', 'sales', 'customer payment'],
    categoryId: 'income_general',
    subcategoryId: 'Business',
  },
  {
    keywords: ['dividend', 'investment return', 'crypto gain', 'stocks', 'interest received'],
    categoryId: 'income_general',
    subcategoryId: 'Investment Return',
  },
];

export function suggestCategory(
  description: string,
  merchant: string = '',
  categories: Category[],
  historicalTransactions: Transaction[] = []
): CategorySuggestion | null {
  const textToAnalyze = `${description} ${merchant}`.toLowerCase().trim();
  if (!textToAnalyze) return null;

  // 1. Check direct historical match from user's transactions (high confidence)
  const normalizedText = textToAnalyze.replace(/[^\w\s]/gi, '');
  const pastMatch = historicalTransactions.find((tx) => {
    const pastText = `${tx.description} ${tx.merchant || ''}`.toLowerCase().replace(/[^\w\s]/gi, '');
    return pastText.length > 3 && (normalizedText.includes(pastText) || pastText.includes(normalizedText));
  });

  if (pastMatch) {
    const cat = categories.find((c) => c.id === pastMatch.categoryId);
    if (cat) {
      return {
        categoryId: cat.id,
        subcategoryId: pastMatch.subcategoryId,
        confidence: 'high',
        reason: `Matched your previous transaction "${pastMatch.description}"`,
      };
    }
  }

  // 2. Check keyword engine rules
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(textToAnalyze) || textToAnalyze.includes(kw)) {
        const cat = categories.find((c) => c.id === rule.categoryId);
        if (cat) {
          return {
            categoryId: cat.id,
            subcategoryId: rule.subcategoryId,
            confidence: kw.length >= 5 ? 'high' : 'medium',
            reason: `Keyword "${kw}" recognized`,
          };
        }
      }
    }
  }

  // 3. Fallback partial category name match
  for (const cat of categories) {
    if (textToAnalyze.includes(cat.name.toLowerCase())) {
      return {
        categoryId: cat.id,
        confidence: 'medium',
        reason: `Matched category name "${cat.name}"`,
      };
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (textToAnalyze.includes(sub.toLowerCase())) {
          return {
            categoryId: cat.id,
            subcategoryId: sub,
            confidence: 'high',
            reason: `Matched subcategory "${sub}"`,
          };
        }
      }
    }
  }

  return null;
}
