import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    common: {
      navigation: {
        home: "Home",
        products: "Products",
        account: "Account",
        cart: "Cart",
        login: "Login",
        register: "Register",
        logout: "Logout"
      },
      auth: {
        loginTitle: "Login to your account",
        registerTitle: "Create new account",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        loginButton: "Login",
        registerButton: "Register",
        forgotPassword: "Forgot password?",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        signUp: "Sign up",
        signIn: "Sign in"
      },
      cart: {
        title: "Shopping Cart",
        addToCart: "Add to Cart",
        removeFromCart: "Remove",
        quantity: "Quantity",
        total: "Total",
        checkout: "Checkout",
        empty: "Your cart is empty",
        continueShopping: "Continue Shopping"
      },
      product: {
        price: "Price",
        condition: "Condition",
        seller: "Seller",
        addToCart: "Add to Cart",
        outOfStock: "Out of Stock",
        inStock: "In Stock",
        description: "Description",
        details: "Details"
      },
      account: {
        profile: "Profile",
        transactions: "Transactions",
        settings: "Settings",
        personalInfo: "Personal Information",
        orderHistory: "Order History",
        preferences: "Preferences"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        language: "Language",
        noResults: "No results"
      },
      homepage: {
        welcome: "Welcome to CardMarket",
        subtitle: "Discover and trade amazing cards",
        featuredProducts: "Featured Products",
        trendingCards: "Trending Cards",
        browseCategories: "Browse Categories"
      },
      trends: {
        title: "Trends",
        bestSellers: "Best Sellers",
        bestBargains: "Best Bargains!",
        loadingTrends: "Loading trends..."
      },
      banners: {
        aetherDrift: {
          title: "AETHER DRIFT",
          subtitle: "Speed into the multiverse",
          cta: "EXPLORE NOW"
        },
        finalFantasy: {
          title: "FINAL FANTASY",
          subtitle: "The ultimate crossover experience",
          cta: "BUY NOW"
        },
        modernHorizons: {
          title: "MODERN HORIZONS",
          subtitle: "Dive into the depths of power",
          cta: "DISCOVER"
        }
      }
    }
  },
  es: {
    common: {
      navigation: {
        home: "Inicio",
        products: "Productos",
        account: "Cuenta",
        cart: "Carrito",
        login: "Iniciar Sesión",
        register: "Registrarse",
        logout: "Cerrar Sesión"
      },
      auth: {
        loginTitle: "Iniciar sesión en tu cuenta",
        registerTitle: "Crear nueva cuenta",
        email: "Correo electrónico",
        password: "Contraseña",
        confirmPassword: "Confirmar Contraseña",
        loginButton: "Iniciar Sesión",
        registerButton: "Registrarse",
        forgotPassword: "¿Olvidaste tu contraseña?",
        dontHaveAccount: "¿No tienes una cuenta?",
        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        signUp: "Regístrate",
        signIn: "Inicia sesión"
      },
      cart: {
        title: "Carrito de Compras",
        addToCart: "Añadir al Carrito",
        removeFromCart: "Eliminar",
        quantity: "Cantidad",
        total: "Total",
        checkout: "Pagar",
        empty: "Tu carrito está vacío",
        continueShopping: "Continuar Comprando"
      },
      product: {
        price: "Precio",
        condition: "Condición",
        seller: "Vendedor",
        addToCart: "Añadir al Carrito",
        outOfStock: "Sin Stock",
        inStock: "En Stock",
        description: "Descripción",
        details: "Detalles"
      },
      account: {
        profile: "Perfil",
        transactions: "Transacciones",
        settings: "Configuración",
        personalInfo: "Información Personal",
        orderHistory: "Historial de Pedidos",
        preferences: "Preferencias"
      },
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        save: "Guardar",
        edit: "Editar",
        delete: "Eliminar",
        search: "Buscar",
        filter: "Filtrar",
        sort: "Ordenar",
        language: "Idioma",
        noResults: "Sin resultados"
      },
      homepage: {
        welcome: "Bienvenido a CardMarket",
        subtitle: "Descubre e intercambia cartas increíbles",
        featuredProducts: "Productos Destacados",
        trendingCards: "Tendencias",
        browseCategories: "Explorar Categorías"
      },
      trends: {
        title: "Tendencias",
        bestSellers: "Más Vendidos",
        bestBargains: "¡Mejores Ofertas!",
        loadingTrends: "Cargando tendencias..."
      },
      banners: {
        aetherDrift: {
          title: "AETHER DRIFT",
          subtitle: "Acelera hacia el multiverso",
          cta: "EXPLORAR AHORA"
        },
        finalFantasy: {
          title: "FINAL FANTASY",
          subtitle: "La experiencia de crossover definitiva",
          cta: "COMPRAR AHORA"
        },
        modernHorizons: {
          title: "MODERN HORIZONS",
          subtitle: "Sumérgete en las profundidades del poder",
          cta: "DESCUBRIR"
        }
      }
    }
  },
  ja: {
    common: {
      navigation: {
        home: "ホーム",
        products: "商品",
        account: "アカウント",
        cart: "カート",
        login: "ログイン",
        register: "登録",
        logout: "ログアウト"
      },
      auth: {
        loginTitle: "アカウントにログイン",
        registerTitle: "新しいアカウントを作成",
        email: "メールアドレス",
        password: "パスワード",
        confirmPassword: "パスワード確認",
        loginButton: "ログイン",
        registerButton: "登録",
        forgotPassword: "パスワードをお忘れですか？",
        dontHaveAccount: "アカウントをお持ちでないですか？",
        alreadyHaveAccount: "すでにアカウントをお持ちですか？",
        signUp: "登録",
        signIn: "ログイン"
      },
      cart: {
        title: "ショッピングカート",
        addToCart: "カートに追加",
        removeFromCart: "削除",
        quantity: "数量",
        total: "合計",
        checkout: "決済",
        empty: "カートは空です",
        continueShopping: "買い物を続ける"
      },
      product: {
        price: "価格",
        condition: "状態",
        seller: "販売者",
        addToCart: "カートに追加",
        outOfStock: "在庫切れ",
        inStock: "在庫あり",
        description: "商品説明",
        details: "詳細"
      },
      account: {
        profile: "プロフィール",
        transactions: "取引履歴",
        settings: "設定",
        personalInfo: "個人情報",
        orderHistory: "注文履歴",
        preferences: "設定"
      },
      common: {
        loading: "読み込み中...",
        error: "エラー",
        success: "成功",
        cancel: "キャンセル",
        save: "保存",
        edit: "編集",
        delete: "削除",
        search: "検索",
        filter: "フィルタ",
        sort: "並び替え",
        language: "言語",
        noResults: "結果なし"
      },
      homepage: {
        welcome: "トレカ市場へようこそ",
        subtitle: "素晴らしいカードを発見して取引しよう",
        featuredProducts: "おすすめ商品",
        trendingCards: "人気カード",
        browseCategories: "カテゴリを見る"
      },
      trends: {
        title: "トレンド",
        bestSellers: "ベストセラー",
        bestBargains: "お得な商品！",
        loadingTrends: "トレンドを読み込み中..."
      },
      banners: {
        aetherDrift: {
          title: "AETHER DRIFT",
          subtitle: "マルチバースへ加速せよ",
          cta: "今すぐ探索"
        },
        finalFantasy: {
          title: "FINAL FANTASY",
          subtitle: "究極のクロスオーバー体験",
          cta: "今すぐ購入"
        },
        modernHorizons: {
          title: "MODERN HORIZONS",
          subtitle: "力の深淵に飛び込もう",
          cta: "発見する"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'ja'],
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    defaultNS: 'common',
    ns: ['common'],

    resources,
  });

export default i18n;