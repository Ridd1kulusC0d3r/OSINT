package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	// Substitua "SEUCPF" pelo seu CPF real
	cpf := "SEUCPF"

	// URL de pesquisa no Google
	url := fmt.Sprintf("https://www.google.com/search?q=%s", cpf)

	// Realiza a solicitação HTTP
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Erro ao fazer a solicitação HTTP:", err)
		return
	}
	defer resp.Body.Close()

	// Lê o corpo da resposta
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Erro ao ler o corpo da resposta:", err)
		return
	}

	// Exibe o conteúdo da página de resultados do Google
	fmt.Println(string(body))
}
