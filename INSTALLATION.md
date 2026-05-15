# Refonte visuelle charte CDC Habitat 2026

## 📦 Contenu de cette archive

Cette archive contient les **18 fichiers** à mettre à jour dans votre projet `rnp2026` pour appliquer la charte graphique officielle CDC Habitat 2026.

**Aucun fichier n'est supprimé** — vous écrasez seulement les fichiers existants.

## 🎨 Ce qui change visuellement

- **Couleurs** : passage au rouge CDC officiel `#E30613` (au lieu du terracotta)
- **Typographies** : Anek Latin (titres, charte CDC) + Inter (texte, substitut Helvetica Now)
- **Logo officiel CDC Habitat** : remplace le cercle terracotta partout (landing, formulaire, admin, login)
- **Boutons** : carrés (border-radius: 4px) plus institutionnels
- **Sidebar admin** : fond blanc avec accent rouge CDC (au lieu de fond noir)
- **Emails transactionnels** : barre rouge CDC en haut, palette CDC

## 📂 Comment installer (5 minutes)

### Étape 1 — Localiser votre dossier local

Sur votre Mac, ouvrez **Finder** et allez dans :
```
Documents > GitHub > rnp2026
```
(ou l'emplacement où GitHub Desktop a cloné le repo)

### Étape 2 — Décompresser cette archive

Double-cliquez sur le fichier `rnp2026-refonte-cdc.zip` qu'on vous a livré. Vous obtenez un dossier `rnp2026-cdc` avec la structure suivante :

```
rnp2026-cdc/
├── app/
│   ├── (auth)/admin/login/login.module.css
│   ├── (auth)/admin/login/page.tsx
│   ├── admin/admin.module.css
│   ├── admin/contenus/contenus.module.css
│   ├── admin/dashboard.module.css
│   ├── admin/emails/emails.module.css
│   ├── admin/inscrits/inscrits.module.css
│   ├── admin/layout.tsx
│   ├── globals.css
│   ├── inscription/RegistrationForm.tsx
│   ├── inscription/inscription.module.css
│   ├── layout.tsx
│   ├── page.module.css
│   └── page.tsx
├── emails/
│   ├── ConfirmationEmail.tsx
│   ├── InvitationEmail.tsx
│   └── ReminderEmail.tsx
└── public/
    └── cdc-habitat-logo.jpg
```

### Étape 3 — Copier tous les fichiers dans votre projet

**Méthode la plus simple** :

1. Dans le Finder, sélectionnez **tout le contenu** du dossier `rnp2026-cdc` (les 3 dossiers `app/`, `emails/`, `public/`)
2. Faites **Cmd + C** (copier)
3. Allez dans votre dossier `Documents > GitHub > rnp2026`
4. Faites **Cmd + V** (coller)
5. Le Mac vous demandera : **"Voulez-vous remplacer les éléments existants ?"**
6. Cliquez sur **« Remplacer »** ou **« Fusionner »** selon les cas

> 💡 Si une boîte de dialogue apparaît pour chaque fichier, **maintenez la touche Option (⌥)** enfoncée et cochez "Appliquer à tous" → puis **Remplacer**.

### Étape 4 — Vérifier dans GitHub Desktop

1. Ouvrez **GitHub Desktop**
2. Sélectionnez le repo `rnp2026`
3. Dans la colonne de gauche **"Changes"**, vous devriez voir **18 fichiers modifiés** (en jaune/orange)
4. Vous pouvez cliquer sur chaque fichier pour voir un aperçu des changements

### Étape 5 — Commit & Push

En bas à gauche de GitHub Desktop :

1. **Summary** : tapez `Refonte visuelle charte CDC Habitat 2026`
2. **Description** (facultatif) : `Couleurs officielles, typo Anek Latin + Inter, logo CDC, palette rouge #E30613`
3. Cliquez sur le bouton **"Commit to main"**
4. En haut, cliquez sur **"Push origin"**

### Étape 6 — Attendre le redéploiement Vercel

1. Allez sur https://vercel.com/rnpcdc2026s-projects/rnp2026
2. Vercel détecte automatiquement le push GitHub
3. Un nouveau déploiement démarre (icône jaune ⏳)
4. **Attendez 2-3 minutes** que le statut passe au vert ✅
5. Allez sur https://rnp2026.vercel.app pour voir le résultat

## ✅ Tests à effectuer après déploiement

- [ ] La page d'accueil affiche le **logo CDC Habitat** officiel en haut à gauche
- [ ] Le titre principal contient **"ensemble le patrimoine"** en **rouge CDC**
- [ ] Le bouton "S'inscrire au séminaire" est **rouge** (au lieu de marron)
- [ ] Cliquez sur "S'inscrire" : le formulaire s'affiche avec le logo CDC en haut
- [ ] Les cartes de visites deviennent **rouge CDC** quand sélectionnées
- [ ] Allez sur `/admin/login` : la page de login a une **barre rouge en haut**
- [ ] Connectez-vous : la sidebar admin est **blanche** avec le logo CDC et un encadré rouge "Rencontre Patrimoine 2026"

## 🆘 En cas de problème

- **Le site ne change pas** → Vérifiez que Vercel a bien terminé le déploiement (icône verte ✅)
- **Erreur de build Vercel** → Allez voir les logs de déploiement et envoyez-les
- **Le logo n'apparaît pas** → Vérifiez que `public/cdc-habitat-logo.jpg` est bien dans le dossier `public/` du repo

---

CDC Habitat — Rencontre Nationale Patrimoine 2026 · Référence DPG-SMO-2026-01
