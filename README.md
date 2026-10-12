# Cadeau protégé

Site statique personnel. La version actuelle ne contient qu’une page de déverrouillage neutre et un paquet chiffré intégral. Aucun fichier photo, texte personnalisé, mot de passe ou source du cadeau en clair n’est publié dans cette version.

Le déchiffrement AES-256-GCM a lieu dans le navigateur, avec une clé dérivée par PBKDF2-SHA256 (600 000 itérations), un sel de 16 octets et un nonce de 12 octets aléatoires. Aucun mot de passe n’est transmis ou mémorisé. Le bouton de verrouillage supprime le contenu déchiffré.

Le paquet chiffré reste téléchargeable : la résistance aux essais hors ligne dépend de la force du mot de passe. Les versions historiques antérieures sans photo demeurent dans Git ; ce changement ne les rend pas secrètes rétroactivement.

GitHub Pages publie la racine de main. Les sources de personnalisation et l’outil de chiffrement restent exclusivement locaux, hors du dépôt.
