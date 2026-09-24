<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <a href="https://github.com/suweed/moneymanager">
        <img src="public/icons/avatarSelfie.png" alt="Logo" width="80" height="80">
    </a>
    <h3 align="center">Mis Gastos</h3>
    <p align="center">
        Aplicación PWA para administrar ingresos y gastos personales
        <br />
        <a href="https://github.com/suweed/moneymanager"><strong>Explore the docs »</strong></a>
        <br />
        <br />
        <a href="https://github.com/suweed/moneymanager">View Demo</a>
        ·
        <a href="https://github.com/suweed/moneymanager/issues">Report Bug</a>
        ·
        <a href="https://github.com/suweed/moneymanager/issues">Request Feature</a>
    </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Screen Shot][product-screenshot]

Dashboard con resumen mensual y anual, desglose por categorías con barras de 2 partes (ingreso verde / gasto rojo), gráficas de pay con tooltip detallado, gestión de movimientos y categorías, navegación por mes y soporte offline como PWA instalable.

<p align="right">(<a href="#readme-top">volver al principio</a>)</p>

### Built With

* [![React][React]][React-url]
* [![Vite][Vite]][Vite-url]
* [![Recharts][Recharts]][Recharts-url]
* [![Node][Node]][Node-url]
* [![Express][Express]][Express-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Postgresql][Postgresql]][Postgresql-url]
* [![Vercel][Vercel]][Vercel-url]

<p align="right">(<a href="#readme-top">volver al principio</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Proyecto con frontend en React (Vite + PWA) y backend en Node.js/Express con Prisma y PostgreSQL.

### Prerequisites

* node
  - https://nodejs.org/es
* npm
  - https://www.npmjs.com/
* postgresql
  - https://www.postgresql.org/

  ```
  npm install
  npm run build
  ```

### Installation

1. Clone the repo
   ```
   git clone https://github.com/suweed/moneymanager.git
   ```
2. Install NPM packages (frontend)
   ```
   npm install
   ```
3. Install server packages
   ```
   cd server
   npm install
   ```
4. In the server folder
   ```
   Create file .env
   ```
   Modified Configs Bd Connection
   ```
    DATABASE_URL="postgresql://<user>:<password>@localhost:5432/moneymanager"
   ```
5. Migrate Data and seed default categories
   ```
   npx prisma db push
   node prisma/seed.js
   ```
6. start project (backend en http://localhost:4000 y frontend en http://localhost:5173)
   ```
   cd server
   npm run dev
   ```
   ```
   cd ..
   npm run dev
   ```

<p align="right">(<a href="#readme-top">volver al principio</a>)</p>

<!-- LICENSE -->
## License

Distribuido bajo la licencia MIT. Consulte `LICENSE` para obtener más información.

<p align="right">(<a href="#readme-top">volver al principio</a>)</p>

<!-- CONTACT -->
## Contact

Jesús Cardozo - [@dRsUgAr1221](https://twitter.com/dRsUgAr1221) - gsuskr2o@gmail.com

Project Link: [https://github.com/suweed/moneymanager](https://github.com/suweed/moneymanager)

<p align="right">(<a href="#readme-top">volver al principio</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/suweed/moneymanager.svg?style=for-the-badge
[contributors-url]: https://github.com/suweed/moneymanager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/suweed/moneymanager.svg?style=for-the-badge
[forks-url]: https://github.com/suweed/moneymanager/network/members
[stars-shield]: https://img.shields.io/github/stars/suweed/moneymanager.svg?style=for-the-badge
[stars-url]: https://github.com/suweed/moneymanager/stargazers
[license-shield]: https://img.shields.io/github/license/suweed/moneymanager.svg?style=for-the-badge
[license-url]: https://github.com/suweed/moneymanager/blob/main/LICENSE.txt
[issues-shield]: https://img.shields.io/github/issues/suweed/moneymanager.svg?style=for-the-badge
[issues-url]: https://github.com/suweed/moneymanager/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/gsuskr2o
[product-screenshot]: public/images/screen.jpg
[React]: https://img.shields.io/badge/react-20232A?style=for-the-badge&logo=react
[React-url]: https://react.dev/
[Vite]: https://img.shields.io/badge/vite-20232A?style=for-the-badge&logo=vite
[Vite-url]: https://vitejs.dev/
[Recharts]: https://img.shields.io/badge/recharts-20232A?style=for-the-badge&logo=recharts
[Recharts-url]: https://recharts.org/
[Node]: https://img.shields.io/badge/node.js-20232A?style=for-the-badge&logo=node.js
[Node-url]: https://nodejs.org/es
[Express]: https://img.shields.io/badge/express-20232A?style=for-the-badge&logo=express
[Express-url]: https://expressjs.com/
[Prisma]: https://img.shields.io/badge/prisma-20232A?style=for-the-badge&logo=prisma
[Prisma-url]: https://www.prisma.io/
[Postgresql]: https://img.shields.io/badge/postgresql-20232A?style=for-the-badge&logo=postgresql
[Postgresql-url]: https://www.postgresql.org/
[Vercel]: https://img.shields.io/badge/vercel-20232A?style=for-the-badge&logo=vercel
[Vercel-url]: https://vercel.com/
