<a name="readme-top"></a>

<div align="center">
<img src='/public/images/logo-alternative.svg' width='200px' height='auto' alt='SmartSaver logo'/>
  
# Smart<span style="color: #6bd39a;">Saver</span>

  <p>Control spendings and increase savings - achieve financial freedom with SmartSaver</p>
</div>

<br>
<br>
<br>
<br>
<br>

<!-- INSTALLATION -->
## :mage_man: Installation
1. Clone repository.
   ```sh
   git clone https://github.com/Arrugonoto/SmartSaver.git
   ```
2. Inside of root directory create `.env` file
3. Configure .env file with necessary secrets:
   ```.env
    #OPEN AI API Key
    OPEN_AI_KEY=""
    ASSISTANT_ID=""
    
    #NextAuth API Key
    NEXTAUTH_URL=""
    NEXTAUTH_SECRET=""
    
    #OAuth Providers
    GITHUB_ID=""
    GITHUB_SECRET=""
    GOOGLE_ID=""
    GOOGLE_SECRET=""
    
    #DB Config
    POSTGRES_URL=""
    POSTGRES_PRISMA_URL=""
    POSTGRES_URL_NON_POOLING=""
    POSTGRES_USER=""
    POSTGRES_HOST=""
    POSTGRES_PASSWORD=""
    POSTGRES_DATABASE=""
    
    #Guest account
    NEXT_PUBLIC_LOGIN="email@email.com"
    NEXT_PUBLIC_PASS="test123456"
   ```
   :warning: Remember! Never upload .env file to repository because it contains important configuration data and exposes them to be exploited.
5. After finished configuration install necessary packages.
   ```sh
   npm i
   ```
6. Run app.
   ```sh
   npm run dev
   ```
<!-- LICENSE -->

<a name="license"></a>

## :placard: License

Distributed under the MIT License. See `LICENSE` file for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
