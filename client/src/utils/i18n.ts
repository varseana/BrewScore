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
    getDirections: "How to get there",
    photos: "photos",
    showLess: "Show less",
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
    getDirections: "Como llegar",
    photos: "fotos",
    showLess: "Ver menos",
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

    // roast policies
    "Roasted in-house every Tuesday and Friday": "Tostado en casa cada martes y viernes",
    "Partnered with local micro-roaster": "Asociado con micro-tostador local",
    "Roasted in-house daily, never more than 48hrs from roast": "Tostado en casa diariamente, nunca mas de 48hrs desde el tueste",
    "Supplied by Cafe Britt": "Suministrado por Cafe Britt",
    "Local roaster, weekly delivery": "Tostador local, entrega semanal",
    "Roasted by Bribri women's cooperative": "Tostado por cooperativa de mujeres Bribri",
    "Small batch roasted weekly": "Tostado en lotes pequenos semanalmente",
    "Roasted on-site in vintage Probat, bean-to-cup in 24hrs": "Tostado en sitio con Probat vintage, del grano a la taza en 24hrs",
    "Roasted locally every Monday": "Tostado localmente cada lunes",
    "Roasted on-site at scale, packaged within 48hrs": "Tostado en sitio a escala, empacado en 48hrs",
    "Commercial supplier": "Proveedor comercial",
    "Roasted on-site at 1400m altitude": "Tostado en sitio a 1400m de altitud",
    "Estate-roasted, same day as harvest processing": "Tostado en finca, mismo dia del procesamiento",
    "Regional supplier": "Proveedor regional",
    "Beans from local Bribri farms, roasted weekly": "Granos de fincas Bribri locales, tostados semanalmente",
    "Small batch roasted weekly by partner roastery": "Tostado en lotes pequenos semanalmente por tostador asociado",
    "Beans sourced from local roasters, rotated monthly": "Granos de tostadores locales, rotados mensualmente",
    "Partnered with Belleville Brulerie, roasted weekly": "Asociado con Belleville Brulerie, tostado semanalmente",
    "Supplied by wholesale roaster": "Suministrado por tostador mayorista",

    // establishment descriptions
    "Third-wave coffee roastery and tasting room in the heart of San Jose.": "Tostaduria de cafe de tercera ola y sala de cata en el corazon de San Jose.",
    "Specialty coffee and brunch spot in Escazu with single-origin Costa Rican beans.": "Cafe de especialidad y brunch en Escazu con granos costarricenses de origen unico.",
    "Coffee library concept. Rotating single-origins from all Costa Rican regions.": "Concepto de biblioteca de cafe. Origenes unicos rotativos de todas las regiones de Costa Rica.",
    "Inside the National Theatre. Historic setting, premium Costa Rican coffee.": "Dentro del Teatro Nacional. Ambiente historico, cafe costarricense premium.",
    "Bohemian cafe with artisan coffee and live music in Barrio Otoya.": "Cafe bohemio con cafe artesanal y musica en vivo en Barrio Otoya.",
    "Indigenous-inspired cuisine and coffee. Beans from Bribri communities.": "Cocina y cafe de inspiracion indigena. Granos de comunidades Bribri.",
    "Honey-processed specialty coffee. Cozy spot near UCR campus.": "Cafe de especialidad procesado con miel. Lugar acogedor cerca del campus de la UCR.",
    "Working coffee plantation with tasting room. Full bean-to-cup experience.": "Plantacion de cafe en funcionamiento con sala de cata. Experiencia completa del grano a la taza.",
    "Third-wave cafe in downtown Heredia. Locally roasted, pour-over focused.": "Cafe de tercera ola en el centro de Heredia. Tostado local, enfocado en vertido.",
    "Famous Costa Rican roaster with tasting room and coffee education center.": "Famoso tostador costarricense con sala de cata y centro de educacion cafetera.",
    "European-style cafe with Costa Rican specialty beans. Great pastries.": "Cafe de estilo europeo con granos de especialidad costarricenses. Excelente reposteria.",
    "Cloud forest coffee experience. Shade-grown beans at altitude.": "Experiencia cafetera del bosque nuboso. Granos cultivados a la sombra en altitud.",
    "Direct from the famous Tarrazu region. Single-estate micro-lots.": "Directo de la famosa region de Tarrazu. Micro-lotes de finca unica.",
    "Colonial-town cafe serving Guanacaste-grown beans. Rustic charm.": "Cafe de pueblo colonial sirviendo granos cultivados en Guanacaste. Encanto rustico.",
    "Caribbean coast specialty coffee. Cacao-coffee fusion drinks.": "Cafe de especialidad de la costa caribe. Bebidas fusion cacao-cafe.",
    "Experimental roastery pushing the boundaries of flavor profiles.": "Tostaduria experimental empujando los limites de los perfiles de sabor.",
    "Southeast Asian-inspired coffee house with traditional brewing methods.": "Casa de cafe de inspiracion del sudeste asiatico con metodos de preparacion tradicionales.",
    "Minimalist espresso bar. No drip. No compromise.": "Bar de espresso minimalista. Sin goteo. Sin compromisos.",
    "Grab-and-go specialty coffee. Fast but never cheap.": "Cafe de especialidad para llevar. Rapido pero nunca barato.",

    // signature drink descriptions
    "Honey-processed Costa Rican pour-over with orange zest": "Vertido costarricense procesado con miel y ralladura de naranja",
    "Sparkling cascara tea with citrus": "Te de cascara espumoso con citricos",
    "3 Costa Rican regions side by side in pour-over": "3 regiones costarricenses lado a lado en vertido",
    "Limited Gesha varietal, hand-poured": "Varietal Gesha limitado, vertido a mano",
    "Double shot with steamed milk and cinnamon": "Doble shot con leche vaporizada y canela",
    "Bribri cacao blended with cold brew, served in jicara": "Cacao Bribri mezclado con cold brew, servido en jicara",
    "Honey-processed espresso with raw honey drizzle": "Espresso procesado con miel y llovizna de miel cruda",
    "Single-lot micro-mill pour-over, changes seasonally": "Vertido de micro-beneficio de lote unico, cambia por temporada",
    "Light roast pour-over with floral notes": "Vertido de tueste claro con notas florales",
    "Signature dark roast double shot": "Doble shot de tueste oscuro signature",
    "Shade-grown cold brew with vanilla and cloud forest honey": "Cold brew cultivado a la sombra con vainilla y miel del bosque nuboso",
    "Single-estate espresso, no milk, no sugar": "Espresso de finca unica, sin leche, sin azucar",
    "Rotating single-origin espresso flight": "Vuelo de espresso de origen unico rotativo",
    "Double ristretto with dark chocolate ganache": "Doble ristretto con ganache de chocolate oscuro",
    "Traditional Indonesian coffee with condensed milk": "Cafe indonesio tradicional con leche condensada",
    "Cold brew with Talamanca cacao and coconut milk": "Cold brew con cacao de Talamanca y leche de coco",
    "Cacao-coffee fusion drinks": "Bebidas fusion cacao-cafe",
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
