# CDACC CPT - Performance Tracker

A repository for CDACC students exam performance tracker built with React, TypeScript, and Firebase.

## Installation

To install this package from GitHub Packages:

```bash
npm install @derroohh/cdacc-cpt
```

Make sure you have a `.npmrc` file in your project root with:

```
@derroohh:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Or set the GitHub token in your environment:

```bash
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Publishing

Releases are automatically published to GitHub Packages when you create a new release on GitHub.

To manually publish:

1. Update the version in `package.json`
2. Build the project: `npm run build`
3. Publish: `npm publish`

## Technologies

- React 19
- TypeScript
- Vite
- Express
- Firebase
- Tailwind CSS
- Google Gemini AI

## License

MIT