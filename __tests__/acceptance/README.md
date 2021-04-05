## Teste unitários

Testa a menor unidade de funcionalidade, geralmente um método / função (por exemplo, dada uma classe com um estado específico, chamar x método na classe deve fazer com que y aconteça). Os testes de unidade devem ser focados em um recurso específico (por exemplo, chamar o método pop quando a pilha está vazia deve gerar um InvalidOperationException). Tudo o que toca deve ser feito na memória; isso significa que o código de teste e o código em teste não devem:

- Convide colaboradores (não triviais)
- Acesse a rede
- Atingir um banco de dados
- Use o sistema de arquivos
- Girar um fio
- etc.

Qualquer tipo de dependência lenta / difícil de entender / inicializar / manipular deve ser stubbed / mocked / seja o que for, usando as técnicas apropriadas para que você possa se concentrar no que a unidade de código está fazendo, e não nas suas dependências.
