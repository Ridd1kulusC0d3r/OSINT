package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

func main() {
	// Defina o nome de usuário alvo
	username := "exemplo"

	// Crie uma URL de pesquisa no Twitter
	url := fmt.Sprintf("https://api.twitter.com/2/users/by/username/%s", username)

	// Defina sua chave de API do Twitter aqui
	apiKey := "SUA_API_KEY_AQUI"

	// Realize a solicitação HTTP para o Twitter API
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	// Leia a resposta JSON
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Analise a resposta JSON
	var userData map[string]interface{}
	err = json.Unmarshal(body, &userData)
	if err != nil {
		log.Fatal(err)
	}

	// Exiba os resultados
	fmt.Println("Nome:", userData["data"].(map[string]interface{})["name"])
	fmt.Println("Localização:", userData["data"].(map[string]interface{})["location"])
	fmt.Println("Descrição:", userData["data"].(map[string]interface{})["description"])
}
