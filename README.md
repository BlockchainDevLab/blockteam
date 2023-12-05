# BLOCKTEAM Títulos Soberanos Sustentáveis #

## Simulação de Emissão de Títulos via Scripts na Blockchain

A blockchain desempenha o papel crucial de servir como um registro imutável e seguro para os títulos emitidos. Promovendo a interoperabilidade ao possibilitar a comunicação eficiente entre diferentes partes envolvidas no ecossistema.

Nessa simulação, scripts programáticos podem ser utilizados para criar e gerenciar títulos, possibilitando uma visão prática e ajustada do funcionamento real do sistema.

Os scripts permitem a definição precisa de parâmetros para a criação de títulos. Essa flexibilidade facilita a adaptação do processo de emissão conforme as necessidades específicas, garantindo uma representação próxima  do cenário operacional.

## Integração aos Sistemas de Informação e Controle

Os contratos resultantes da simulação podem ser perfeitamente integrados aos sistemas de informação e controle existentes. Essa integração permite que os dados e eventos relacionados aos títulos sejam automaticamente registrados e rastreados.

## 1 - DEPLOY DO CONTRATO

      npx hardhat run scripts/1-deploy.js --network mumbai
**OBS: colocar as configurações no arquivo .env - veja o exemplo env.example**

## 2 - CRIAR OS TIPOS DE TITULOS

       npx hardhat run scripts/2-security-roles.js --network mumbai

## 3 - CRIAR OS TIPOS DE TITULOS

       npx hardhat run scripts/3-create-types.js --network mumbai

## 4 - EMITIR O TITULO PARA A CONTA SOB A CUSTODIA DA SELIC

        npx hardhat run scripts/4-issue-bond.js --network mumbai  

## 5 - CRIAR OS DADOS DO TITULO NO STORAGE

       npx hardhat run scripts/5-create-data-bonds.js --network mumbai

# ARQUITETURA DOS CONTRATOS

**Segurança e Interoperabilidade:**

A arquitetura de segurança implementada visa promover a interoperabilidade ao fornecer informações específicas para os títulos, adaptadas às necessidades de cada agente participante do processo. Essa abordagem assegura que apenas agentes autorizados possuam a capacidade de modificar os dados definidos nos metadados associados a cada tipo de título.

**Controle de Acesso:**

O acesso e a manipulação dos "papéis" ou funções estão restritos a um usuário MASTER exclusivo. Somente este usuário MASTER tem o privilégio de adicionar contas com acesso a essas funções específicas. Vale ressaltar que a conta MASTER é configurada como uma conta mult - signer, com a flexibilidade de ser gerenciada por um dispositivo de Segurança de Módulo de Hardware (HSM, na sigla em inglês).

Essa estrutura proporciona um nível robusto de controle e segurança, garantindo que apenas usuários devidamente autorizados possam influenciar as configurações e operações fundamentais relacionadas aos títulos, enquanto a conta MASTER, gerenciada por HSM, confere uma camada adicional de proteção à integridade do sistema.

**Módulo de Segurança de Hardware (HSM):**

![Integração com HSM](/docs/TN Green Bonds Tokenizados.png)

Um Módulo de Segurança de Hardware (HSM) é um dispositivo físico dedicado projetado para proteger e gerenciar chaves criptográficas, além de realizar operações criptográficas. Com características de alta resistência a adulterações e desempenho robusto, os HSMs são ideais para salvaguardar dados sensíveis e facilitar transações digitais.

Amplamente empregados em setores que lidam com volumes substanciais de informações sensíveis, como bancos, finanças e saúde, os HSMs oferecem diversos benefícios:

* **Segurança Aprimorada:** Proporcionam o mais elevado nível de segurança para dados e chaves criptográficas, sendo menos suscetíveis a ataques de malware ou vulnerabilidades do sistema operacional.

* **Conformidade com Regulamentos:** Auxiliam organizações no cumprimento de regulamentos de segurança de dados, como PCI DSS e HIPAA.

* **Redução do Risco de Violações de Dados:** Significativamente diminuem o risco de violações de dados e ataques cibernéticos.

* **Melhoria da Confiança do Cliente:** Reforçam a confiança do cliente ao demonstrar um compromisso robusto com a segurança de dados.

O uso de HSMs representa uma estratégia eficaz para proteger informações críticas e fortalecer a integridade das operações digitais em diversos setores sensíveis.
