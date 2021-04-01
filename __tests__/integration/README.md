## Teste de integração

Os testes de integração se baseiam em testes de unidade combinando as unidades de código e testando se a combinação resultante funciona corretamente. Isso pode ser o interior de um sistema ou a combinação de vários sistemas para fazer algo útil. Os testes de integração podem e vão usar threads, acessar o banco de dados ou fazer o que for necessário para garantir que todo o código e as diferentes alterações no ambiente funcionem corretamente.

```
Se você criou algum código de serialização e a unidade testou suas entranhas sem tocar no disco, como você sabe que ele funcionará quando você estiver carregando e salvando no disco? Talvez você tenha esquecido de liberar e descartar os filmes. Talvez suas permissões de arquivo estejam incorretas e você tenha testado as entranhas usando em fluxos de memória. A única maneira de descobrir com certeza é testá-lo 'de verdade' usando um ambiente mais próximo da produção.
```

A principal vantagem é encontrar erros que os testes de unidade não podem, como erros de fiação (por exemplo, uma instância da classe A recebe inesperadamente uma instância nula de B) e erros de ambiente (ele funciona bem na minha máquina com CPU única, mas meu a máquina de 4 núcleos do colega não pode passar nos testes). A principal desvantagem é que os testes de integração tocam mais código, são menos confiáveis, as falhas são mais difíceis de diagnosticar e os testes são mais difíceis de manter.

Além disso, os testes de integração não necessariamente provam que um recurso completo funciona. O usuário pode não se importar com os detalhes internos dos meus programas, mas eu sim!
