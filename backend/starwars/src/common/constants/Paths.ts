
export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Cartes: {
    Base: '/cartes',
    Get: '/all',
  },
  Decks: {
    Base: '/decks',
    Get: '/all',
    Post: '/ajouter',
    Put: '/modifier/:id',
    Delete: '/supprimer/:id',
  },
  Parties: {
    Base: '/parties',
    Get: '/all',
    Post: '/ajouter',
    Put: '/modifier/:id',
    Delete: '/supprimer/:id',
  },
  Utilisateurs: {
    Base: '/utilisateurs',
    Get: '/all',
    Post: '/ajouter',
    VerifMdp: '/verifMdp',
    Delete: '/supprimer/:id',
  },
} as const;
