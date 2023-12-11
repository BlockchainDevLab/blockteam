# BLOCKTEAM: Títulos Soberanos Sustentáveis Tokenizados #

Automatizar a padronização e compliance dos títulos sustentáveis para criar um ciclo de prosperidade e impacto socioambiental.

A blockchain desempenha o papel crucial de servir como um registro imutável e seguro para os títulos emitidos. Promovendo a interoperabilidade ao possibilitar a comunicação eficiente entre diferentes partes envolvidas no ecossistema.

## **Benefícios**

Segurança - a Blockchain traz segurança resiliência e transparência para a gestão dos Títulos Soberanos Sustentáveis


Gestão - A STN e o CFSS têm total controle sobre a emissão de ativos e registro de dados


Transparência - Melhores condições de price discovery e monitoramento de dados das beneficiárias, graças à unificação dos dados em um único ativo

[PITCH DECK: Títulos Soberanos Sustentáveis](/docs/Hackathon%20TN%20Pitch%20Deck.pdf)


## Equipe
- Paula: https://www.linkedin.com/in/paula-palermo/
- Marcelo Silva: https://www.linkedin.com/in/marcelo-silva-0581b9216/
- Verber Souza: https://www.linkedin.com/in/verber-s-095a17145/
- Renato Pergoretti: http://linkedin.com/in/renato-💭-pegoretti-65b49285
- Ariel Leite: https://www.linkedin.com/in/ariel-leite/
- Valter Lobo: https://www.linkedin.com/in/valterlobo
- Marcelo Creimer: https://www.linkedin.com/in/marcelo-creimer/


## Integração aos Sistemas de Informação e Controle

Os contratos resultantes da simulação podem ser perfeitamente integrados aos sistemas de informação e controle existentes. Essa integração permite que os dados e eventos relacionados aos títulos sejam automaticamente registrados e rastreados.

![Contrato](/docs/fluxo.jpeg)

## Simulação de Emissão de Títulos via Scripts na Blockchain

Nessa simulação, scripts programáticos podem ser utilizados para criar e gerenciar títulos, possibilitando uma visão prática e ajustada do funcionamento real do sistema.

Os scripts permitem a definição precisa de parâmetros para a criação de títulos. Essa flexibilidade facilita a adaptação do processo de emissão conforme as necessidades específicas, garantindo uma representação próxima  do cenário operacional.


## 1 - DEPLOY DO CONTRATO

      npx hardhat run scripts/1-deploy.js --network mumbai
**OBS: colocar as configurações no arquivo .env - veja o exemplo env.example**

## 2 -  AUTORIZAR OS  ACESSOS

       npx hardhat run scripts/2-security-roles.js --network mumbai

## 3 - CRIAR OS TIPOS DE TITULOS

       npx hardhat run scripts/3-create-types.js --network mumbai

## 4 - EMITIR O TITULO PARA A CONTA SOB A CUSTODIA DA SELIC

        npx hardhat run scripts/4-issue-bond.js --network mumbai  

## 5 - CRIAR OS DADOS DO TITULO NO STORAGE

       npx hardhat run scripts/5-create-data-bonds.js --network mumbai


## Deploy do contrato

O processo de deploy foi concluído com sucesso na testnet de Mumbai, tokenizando um título por meio de uma NFT ERC-1155.Permite testes extensivos em um ambiente controlado antes do deploy na rede principal(mainet).

Os próximos passos incluem testes mais abrangentes, feedback contínuo e a preparação para o deploy na rede principal.

**NFT ERC-1155**

O título foi tokenizado utilizando o padrão ERC-1155, uma norma de token não fungível que oferece maior flexibilidade ao suportar vários tokens em uma única contraparte. A decisão de utilizar o padrão ERC-1155 para representar títulos revela-se estratégica devido às suas características distintivas. Este padrão permite a fracionação eficiente dos ativos, simplificando a gestão ao consolidar diferentes tipos de títulos em um único smart contract. Além de reduzir custos e complexidades, o ERC-1155 é amplamente reconhecido na indústria, proporcionando interoperabilidade e facilitando a implementação de lógicas de negócios personalizadas. Essa escolha promove um ecossistema mais dinâmico, padronizado e adaptável para os participantes.


![Contrato](/docs/image-titulo.svg)

[NFT OPEN SEA][https://testnets.opensea.io/assets/mumbai/0x47d9b72714323340f594e8a6f8bb3c1bf0a4259d/202201101]


[REGISTRO DO CONTRATO)
[https://mumbai.polygonscan.com/address/0x47d9b72714323340f594e8a6f8bb3c1bf0a4259d]


# ARQUITETURA DOS CONTRATOS

**Segurança e Interoperabilidade**

A arquitetura de segurança implementada visa promover a interoperabilidade ao fornecer informações específicas para os títulos, adaptadas às necessidades de cada agente participante do processo. Essa abordagem assegura que apenas agentes autorizados possuam a capacidade de modificar os dados definidos nos metadados associados a cada tipo de título.

**Personalização e Controle de Metadados nos Títulos**

A capacidade de personalizar os títulos de acordo com suas características específicas é fornecida por meio dos metadados. Simultaneamente, implementamos um modelo de controle rigoroso, onde apenas os agentes autorizados têm a permissão de inserir ou atualizar informações nos títulos, conforme definido pelo "papel" associado à conta no controle de segurança (AuthorizationControl). Esse enfoque assegura que apenas as partes devidamente autorizadas possam atualizar as informações dos títulos, garantindo a integridade e a segurança do registro do título.

**Controle de Acesso**

O acesso e a manipulação dos "papéis" ou funções estão restritos a um usuário MASTER exclusivo. Somente este usuário MASTER tem o privilégio de adicionar contas com acesso a essas funções específicas. Vale ressaltar que a conta MASTER é configurada como uma conta mult - signer, com a flexibilidade de ser gerenciada por um dispositivo de Segurança de Módulo de Hardware (HSM, na sigla em inglês).

Essa estrutura proporciona um nível robusto de controle e segurança, garantindo que apenas usuários devidamente autorizados possam influenciar as configurações e operações fundamentais relacionadas aos títulos, enquanto a conta MASTER, gerenciada por HSM, confere uma camada adicional de proteção à integridade do sistema.

**Arquitetura de segurança**

A arquitetura de segurança é projetada de forma centralizada, compartilhada entre os diversos contratos inteligentes, eliminando a necessidade de atualizações em todos os contratos relacionados aos papéis de segurança. Essa abordagem otimiza a eficiência e a manutenção do sistema, garantindo que as políticas e controles de segurança sejam aplicados de maneira uniforme e consistente em toda a rede de contratos. Ao concentrar a gestão de segurança em uma estrutura compartilhada, reduzimos a complexidade operacional e promovemos uma implementação mais coesa e fácil de manter.


![Arquitetura de segurança:](/docs/security.png)

**Módulo de Segurança de Hardware (HSM)**




Um Módulo de Segurança de Hardware (HSM) é um dispositivo físico dedicado projetado para proteger e gerenciar chaves criptográficas, além de realizar operações criptográficas. Com características de alta resistência a adulterações e desempenho robusto, os HSMs são ideais para salvaguardar dados sensíveis e facilitar transações digitais.

Amplamente empregados em setores que lidam com volumes substanciais de informações sensíveis, como bancos, finanças e saúde, os HSMs oferecem diversos benefícios:

* **Segurança Aprimorada:** Proporcionam o mais elevado nível de segurança para dados e chaves criptográficas, sendo menos suscetíveis a ataques de malware ou vulnerabilidades do sistema operacional.

* **Conformidade com Regulamentos:** Auxiliam organizações no cumprimento de regulamentos de segurança de dados, como PCI DSS e HIPAA.

* **Redução do Risco de Violações de Dados:** Significativamente diminuem o risco de violações de dados e ataques cibernéticos.

* **Melhoria da Confiança do Cliente:** Reforçam a confiança do cliente ao demonstrar um compromisso robusto com a segurança de dados.

O uso de HSMs representa uma estratégia eficaz para proteger informações críticas e fortalecer a integridade das operações digitais em diversos setores sensíveis.

![Integração com HSM](/docs/HSM-ESQUEMA.png)
