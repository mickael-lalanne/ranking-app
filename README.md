<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="README-icon.png" alt="Logo" width="80" height="80">

  <h3 align="center">Ranking App</h3>

  <p align="center">
      By Mickaël Lalanne
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
    <li>
      <a href="#👷-backend-utilities">👷 Backend utilities</a>
      <ul>
        <li><a href="#how-to-debug-in-vs-code">How to debug in VS Code</a></li>
        <li><a href="#handle-changes-in-the-backend-architecture">Handle changes in the backend architecture</a></li>
      </ul>
   </li>
    <li>
      <a href="#📋-tests">📋 Tests</a>
      <ul>
        <li><a href="#jest-unit-tests">Jest - Unit tests</a></li>
        <li><a href="#cypress-end-to-end-tests">Cypress - End To End tests</a></li>
      </ul>
   </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About the project

![Product Name Screen Shot][product-screenshot]
Ranking App is a web application allowing users to create their own templates and tierlists.<br>
First, users create their templates by setting a name, tiers and elements they want to rank.<br>
Then, they use their templates to create tierlists. Users can save the result and even download it as a PNG image.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React]][React-url]
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
* [![.NET][NET]][NET-url]
* ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
* ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
* ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
* ![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)

And also [Clerk](https://clerk.com/) for authentication and [Cloudinary](https://cloudinary.com/) for image management. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Nodejs](https://nodejs.org/en)
* [.NET](https://dotnet.microsoft.com/en-us/learn/dotnet/what-is-dotnet)
* [PostgreSQL](https://www.postgresql.org/) <br>
With a `Ranking_App_DB` database, use the `setupDB.sql` script to initialize the database schema
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
3. Store the sensitive data in the local secret store
   ```sh
   cd ..
   dotnet user-secrets init
   dotnet user-secrets set "Cloudinary:CloudName" "<cloud_name>"
   dotnet user-secrets set "Cloudinary:ApiKey" "<api_key>"
   dotnet user-secrets set "Cloudinary:ApiSecret" "<api_secret>"

   dotnet user-secrets set "Clerk:Authority" "<clerk_authority>"
   dotnet user-secrets set "Clerk:AuthorizedParty" "https://localhost:44412"
   ```
   *<ins>FYI</ins> : in production, those values should be stored in Environment variables with the following syntax : "Cloudinary__CloudName" or "Clerk__Authority"* <br>
   *Cf [Configuration keys and values](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-8.0#configuration-keys-and-values)*
4. Run the app locally
   ```sh
   dotnet run
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👷 Backend utilities

### How to debug in VS Code
1. Set a breakpoint
2. Press F5

### Handle changes in the backend architecture

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

## 📋 Tests

### Jest - Unit tests
* Run a specific test 
   ```sh
   npm test -- your_file_name.tsx
   ```
* Run all tests
   ```sh
   npm test
   ```
### Cypress - End To End tests
* Run a specific test 
   ```sh
   npx cypress run --spec cypress/e2e/your_test_name.cy.ts --env type=base --browser chrome
   ```
* Run tests in the cypress console
   ```sh
   npm run cypress:open
   ```
* Change base screenshots used for visual testing 
   ```sh
   npm run cypress:takeBaseScreenshots
   ```
<br>


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
* [Tutorial: How to Use C# with React and TypeScript](https://kenny-designs.github.io/articles/2022-06-05-csharp-react-typescript-tutorial.html)
* [Safe storage of app secrets in development in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-8.0&tabs=windows)
* [Using GitHub Actions For CI/CD with .NET Core 5 and AWS Elastic Beanstalk)](https://medium.com/geekculture/using-github-actions-for-ci-cd-with-net-core-5-and-aws-elastic-beanstalk-5141228b61bd)
* [Clerk SDK for .NET by Hawxy](https://github.com/Hawxy/Clerk.Net?tab=readme-ov-file#what-about-jwt-auth)
* [Adding a custom domain for the AWS Elastic Beanstalk application using Route 53.](https://medium.com/@chiragmehta900/adding-a-custom-domain-for-the-aws-elastic-beanstalk-application-using-route-53-1fd89f204651)

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