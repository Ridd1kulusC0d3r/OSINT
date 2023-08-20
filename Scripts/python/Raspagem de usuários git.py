import requests

def buscar_usuario_github(username):
    url = f"https://api.github.com/users/{username}"
    response = requests.get(url)

    if response.status_code == 200:
        dados_usuario = response.json()
        return dados_usuario
    elif response.status_code == 404:
        return None
    else:
        print(f"Ocorreu um erro ao buscar o usuário: {response.status_code}")
        return None

username = input("Digite o nome de usuário do GitHub: ")
dados_usuario = buscar_usuario_github(username)

if dados_usuario:
    print("Dados do usuário:")
    print(f"Nome: {dados_usuario['name']}")
    print(f"Bio: {dados_usuario['bio']}")
    print(f"Seguidores: {dados_usuario['followers']}")
else:
    print("Usuário não encontrado no GitHub.")
