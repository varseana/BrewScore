// ⁘[ TRADUCCIONES ]⁘
// en/es ~ lo basico para que funcione

const translations = {
  en: {
    // header
    explore: "Explore",
    feed: "Feed",
    admin: "Admin",
    signIn: "Sign In",
    logout: "Logout",
    profile: "Profile",

    // home
    searchPlaceholder: "Search coffee shops...",
    map: "Map",
    list: "List",
    spotsFound: (n: number) => `${n} spots found`,
    loading: "Loading...",
    noSpotsTitle: "No spots found",
    noSpotsDesc: "Try zooming out or changing your search",
    nearMe: "Near Me",

    // preview
    viewFullProfile: "View Full Profile",
    brewingMethods: "Brewing Methods",
    beanOrigins: "Bean Origins",
    equipment: "Equipment",
    signatureDrinks: "Signature Drinks",
    roastPolicy: "Roast Policy",
    daysFromRoast: "days from roast",
    milkOptions: "Milk Options",
    coffeeProgram: "Coffee Program",
    waterFiltration: "Water Filtration",
    verified: "Verified",
    underReview: "Under review — some information may be inaccurate",

    // auth
    welcomeBack: "Welcome back",
    joinBrewScore: "Join BrewScore",
    signInDesc: "Sign in to track your coffee journey",
    signUpDesc: "Start discovering great coffee",
    yourName: "Your name",
    email: "Email",
    password: "Password",
    createAccount: "Create Account",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    hasAccount: "Already have an account?",

    // profile
    reviews: "Reviews",
    followers: "followers",
    following: "following",
    follow: "Follow",
    unfollow: "Unfollow",
    noReviews: "No reviews yet.",

    // establishment
    writeReview: "Write Review",
    report: "Report",
    save: "Save",
    saved: "Saved",

    // review modal
    writeAReview: "Write a Review",
    overall: "Overall",
    bean: "Bean",
    prep: "Preparation",
    equipmentRating: "Equipment",
    consistency: "Consistency",
    whatDidYouOrder: "What did you order?",
    tellUsExperience: "Tell us about your experience...",
    submitReview: "Submit Review",
    submitting: "Submitting...",

    // report modal
    reportEstablishment: "Report Establishment",
    misleadingInfo: "Misleading Information",
    falseProcedures: "False Procedures",
    fakeEquipment: "Fake Equipment Claims",
    other: "Other",
    describeIssue: "Describe the issue in detail...",
    anonymousNote: "Your identity will remain anonymous to the establishment owner.",
    submitReport: "Submit Report",

    // feed
    global: "Global",
    topConnoisseurs: "Top Connoisseurs",
    noFeedFollowing: "No reviews from people you follow yet",
    followSuggestion: "Follow some connoisseurs to see their reviews here",
    noFeedGlobal: "No reviews yet",
    loadMore: "Load more",

    // explore
    minRating: "Min rating:",
    any: "Any",
    roastsInHouse: "Roasts in-house",
    sort: "Sort:",
    topRated: "Top Rated",
    transparency: "Transparency",
    newest: "Newest",
    results: (n: number) => `${n} results`,
    searching: "Searching...",
    noMatchTitle: "No spots match your filters",
    noMatchDesc: "Try broadening your search",

    // footer
    footerText: "BrewScore — Coffee transparency for everyone",

    // 404
    pageNotFound: "Page not found",
    pageNotFoundDesc: "This page doesn't exist or has been moved.",
    backToMap: "Back to Map",

    // language
    chooseLanguage: "Choose your language",
    continueBtn: "Continue",
  },

  es: {
    explore: "Explorar",
    feed: "Feed",
    admin: "Admin",
    signIn: "Iniciar Sesion",
    logout: "Cerrar Sesion",
    profile: "Perfil",

    searchPlaceholder: "Buscar cafeterias...",
    map: "Mapa",
    list: "Lista",
    spotsFound: (n: number) => `${n} lugares encontrados`,
    loading: "Cargando...",
    noSpotsTitle: "No se encontraron lugares",
    noSpotsDesc: "Intenta alejar el zoom o cambiar tu busqueda",
    nearMe: "Cerca de mi",

    viewFullProfile: "Ver Perfil Completo",
    brewingMethods: "Metodos de Preparacion",
    beanOrigins: "Origen del Grano",
    equipment: "Equipo",
    signatureDrinks: "Bebidas Especiales",
    roastPolicy: "Politica de Tueste",
    daysFromRoast: "dias desde el tueste",
    milkOptions: "Opciones de Leche",
    coffeeProgram: "Programa de Cafe",
    waterFiltration: "Filtracion de Agua",
    verified: "Verificado",
    underReview: "En revision — alguna informacion puede ser inexacta",

    welcomeBack: "Bienvenido de vuelta",
    joinBrewScore: "Unete a BrewScore",
    signInDesc: "Inicia sesion para seguir tu viaje cafetero",
    signUpDesc: "Empieza a descubrir buen cafe",
    yourName: "Tu nombre",
    email: "Correo",
    password: "Contrasena",
    createAccount: "Crear Cuenta",
    noAccount: "No tienes cuenta?",
    signUp: "Registrate",
    hasAccount: "Ya tienes cuenta?",

    reviews: "Resenas",
    followers: "seguidores",
    following: "siguiendo",
    follow: "Seguir",
    unfollow: "Dejar de seguir",
    noReviews: "Sin resenas aun.",

    writeReview: "Escribir Resena",
    report: "Reportar",
    save: "Guardar",
    saved: "Guardado",

    writeAReview: "Escribir una Resena",
    overall: "General",
    bean: "Grano",
    prep: "Preparacion",
    equipmentRating: "Equipo",
    consistency: "Consistencia",
    whatDidYouOrder: "Que pediste?",
    tellUsExperience: "Cuentanos tu experiencia...",
    submitReview: "Enviar Resena",
    submitting: "Enviando...",

    reportEstablishment: "Reportar Establecimiento",
    misleadingInfo: "Informacion Enganosa",
    falseProcedures: "Procedimientos Falsos",
    fakeEquipment: "Equipo Falso",
    other: "Otro",
    describeIssue: "Describe el problema en detalle...",
    anonymousNote: "Tu identidad sera anonima para el dueno del establecimiento.",
    submitReport: "Enviar Reporte",

    global: "Global",
    topConnoisseurs: "Top Conocedores",
    noFeedFollowing: "Aun no hay resenas de gente que sigues",
    followSuggestion: "Sigue a algunos conocedores para ver sus resenas aqui",
    noFeedGlobal: "Aun no hay resenas",
    loadMore: "Cargar mas",

    minRating: "Rating minimo:",
    any: "Cualquiera",
    roastsInHouse: "Tuesta en casa",
    sort: "Ordenar:",
    topRated: "Mejor Valorados",
    transparency: "Transparencia",
    newest: "Mas Recientes",
    results: (n: number) => `${n} resultados`,
    searching: "Buscando...",
    noMatchTitle: "Ningun lugar coincide con tus filtros",
    noMatchDesc: "Intenta ampliar tu busqueda",

    footerText: "BrewScore — Transparencia cafetera para todos",

    pageNotFound: "Pagina no encontrada",
    pageNotFoundDesc: "Esta pagina no existe o fue movida.",
    backToMap: "Volver al Mapa",

    chooseLanguage: "Elige tu idioma",
    continueBtn: "Continuar",
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

// ⁘[ TERMINOS DINAMICOS ]⁘
// para traducir valores que vienen del backend (leche, equipo, etc)

const dynamicTerms: Record<string, Record<string, string>> = {
  es: {
    // milk options
    "whole": "entera",
    "oat": "avena",
    "almond": "almendra",
    "coconut": "coco",
    "skim": "descremada",
    "soy": "soya",
    "condensed milk": "leche condensada",

    // equipment types
    "espresso machine": "maquina de espresso",
    "grinder": "molino",
    "manual": "manual",
    "roaster": "tostador",
    "hand grinder": "molino manual",

    // water filtration
    "water filtration": "filtracion de agua",
    "Carbon filter": "filtro de carbon",
    "Carbon block filter": "filtro de carbon en bloque",
    "Reverse osmosis + mineral dosing": "osmosis inversa + dosificacion mineral",
    "BWT Bestmax Premium": "BWT Bestmax Premium",
    "Everpure filtration system": "sistema de filtracion Everpure",
    "Industrial filtration": "filtracion industrial",
    "Mountain spring water": "agua de manantial",
    "Mountain spring": "agua de manantial",
    "Spring water from Talamanca": "agua de manantial de Talamanca",
    "Cloud forest spring water": "agua de manantial del bosque nuboso",

    // brewing methods
    "espresso": "espresso",
    "pour-over": "vertido",
    "cold brew": "cold brew",
    "French press": "prensa francesa",
    "AeroPress": "AeroPress",
    "siphon": "sifon",
    "drip": "goteo",
    "batch brew": "preparacion por lotes",
    "cupping": "catacion",
    "ristretto": "ristretto",
    "lungo": "lungo",
    "cappuccino": "cappuccino",
    "kopi tubruk": "kopi tubruk",
    "Vietnamese phin": "phin vietnamita",
    "Chemex": "Chemex",

    // general
    "days from roast": "dias desde el tueste",
  },
};

export function translateTerm(term: string, lang: Lang): string {
  if (lang === "en") return term;
  const dict = dynamicTerms[lang];
  if (!dict) return term;
  // buscar exacto primero, luego case-insensitive
  if (dict[term]) return dict[term];
  const lower = term.toLowerCase();
  if (dict[lower]) return dict[lower];
  return term;
}

export default translations;
