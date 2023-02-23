from cardano import Cardano
from  pprint import pp

cardano= Cardano()

print("Resolving SCHEMA")
pp(cardano.resolveObject("did:prism:123456789abcdefghi/resources/76ff2d0cd3f8990da003727d5e89a2c4607505636fd1e8d1d048985880871d4c"))
print("\n")

print("Resolving CRED_DEF")
pp(cardano.resolveObject("did:prism:123456789abcdefghi/resources/29b95c26757952b6436dcc24e68551d05dbe2f563c89c80834ed4a0c168a5b5f"))
print("\n")

print("Resolving REV_REG")
pp(cardano.resolveObject("did:prism:123456789abcdefghi/resources/e7ed6e0db23938604eafd8fee22614bd5b02fecfba4707363e1a2b65e25611e8"))
print("\n")



