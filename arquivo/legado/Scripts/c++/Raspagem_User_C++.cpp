#include <iostream>
#include <string>
#include <curl/curl.h>

// Função para escrever o resultado da requisição em um buffer
size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string response;

    // Inicializar a biblioteca libcurl
    curl_global_init(CURL_GLOBAL_DEFAULT);

    // Inicializar o objeto CURL
    curl = curl_easy_init();
    if (curl) {
        // URL da API do GitHub para buscar informações de um usuário (substitua "username" pelo nome do usuário desejado)
        std::string url = "https://api.github.com/users/username";

        // Configurar a URL
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

        // Definir a função de callback para processar a resposta
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        // Realizar a requisição
        res = curl_easy_perform(curl);

        // Verificar erros
        if (res != CURLE_OK) {
            std::cerr << "Erro na requisição: " << curl_easy_strerror(res) << std::endl;
        } else {
            // Exibir a resposta
            std::cout << "Dados do usuário: " << response << std::endl;
        }

        // Limpar
        curl_easy_cleanup(curl);
    }

    // Encerrar a biblioteca libcurl
    curl_global_cleanup();

    return 0;
}
