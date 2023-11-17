<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="react_icon.png" alt="Logo" width="80" height="80">

  <h3 align="center">Mickaël Lalanne</h3>

  <p align="center">
    Ranking app with React, .NET and PostgreSQL.
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
    <li><a href="#👷-handle-changes-in the-backend-architecture">Handle changes in the backend architecture</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About the project

<!-- ![Product Name Screen Shot][product-screenshot] -->
Description coming soon...

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React]][React-url]
* [![.NET][NET]][NET-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Nodejs](https://nodejs.org/en)
* [.NET](https://dotnet.microsoft.com/en-us/learn/dotnet/what-is-dotnet)
* [PostgreSQL](https://www.postgresql.org/)
* [Entity Framework](https://learn.microsoft.com/en-us/aspnet/entity-framework/)
   ```sh
   dotnet tool install --global dotnet-ef --version 7.*
   ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mickael-lalanne/ranking-app.git
   ```
2. Install client dependencies
   ```sh
   cd client
   npm install
   ```
3. Run the app locally
   ```sh
   cd ..
   dotnet run
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👷 Handle changes in the backend architecture

+ When a change is made (to a model or a controller for example)
1. Create a migration
   ```sh
   dotnet ef migrations add your_migration_name --context RankingAppDbContext
   ```
2. Then, update the database
   ```sh
   dotnet ef database update --context RankingAppDbContext
   ```
<br>

+ When a change needs to be reverted
1. First, update the database by specifying the last migration name
   ```sh
   dotnet ef database update your_migration_name --context RankingAppDbContext
   ```
2. Then, remove the migration (it will delete all corresponding files contained in the "Migrations" folder)
   ```sh
   dotnet ef migrations remove --context RankingAppDbContext
   ```
<br>

+ To revert the initial migration, use 0 instead of the migration name
   ```sh
   dotnet ef database update 0 --context RankingAppDbContext
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Mickaël Lalanne - mickael.lalanne03@gmail.com

[![LinkedIn][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Entity Framework](https://learn.microsoft.com/en-us/aspnet/entity-framework)
* [Building a Robust ASP.NET Core Web API with PostgreSQL](https://www.c-sharpcorner.com/article/building-a-powerful-asp-net-core-web-api-with-postgresql/)
* [Create a React App with .NET 5 API Backend in VSCode (Entity Framework Core & Postgres)](https://www.youtube.com/watch?v=2Ayfi7OJhBI)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: demo.gif
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/mickael-lalanne/
[React]:  https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://fr.react.dev/
[NET]: https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white
[NET-url]: https://dotnet.microsoft.com/en-us/learn/dotnet/what-is-dotnet