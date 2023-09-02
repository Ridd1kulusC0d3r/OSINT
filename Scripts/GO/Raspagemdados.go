package main

import (
	"fmt"
	"log"

	"github.com/gocolly/colly/v2"
)

func main() {
	// Crie um novo coletor
	c := colly.NewCollector()

	// Defina as regras de raspagem
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		fmt.Println(link)
	})

	// Visite uma página da web
	err := c.Visit("https://example.com")
	if err != nil {
		log.Fatal(err)
	}
}
