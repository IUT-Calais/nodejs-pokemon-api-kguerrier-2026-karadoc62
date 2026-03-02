import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();
  
  await prisma.user.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  
  await prisma.pokemonCard.create({
    data:
      { 
        name:"Bulbizarre",
        pokedexId:1,
        size:0.7,
        type: {connect: {name: 'Normal'}}, // Référence à l'id de la table types
        lifePoints:45,
        weight:6.9,
        imageUrl:"https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
      }
  });

  await prisma.pokemonCard.create({
    data:
      { 
        name: "Herbizarre",
        pokedexId: 2,
        type: {connect: {name: 'Normal'}},
        lifePoints: 60,
        size: 1.0,
        weight: 13.0,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png"
      }
  });

  await prisma.pokemonCard.create({
    data:
      { 
        name: "Florizarre",
        pokedexId: 3,
        type: {connect: {name: 'Normal'}},
        lifePoints: 80,
        size: 2.0,
        weight: 100.0,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png"
      }
  });

  await prisma.pokemonCard.create({
    data:
      { 
        name: "Salameche",
        pokedexId: 4,
        type: {connect: {name: 'Fire'}},
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png"
      }
  });

  await prisma.pokemonCard.create({
    data:
      { 
        name: "Carapuce",
        pokedexId: 7,
        type: {connect: {name: 'Water'}},
        lifePoints: 44,
        size: 0.5,
        weight: 9.0,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
      }
  });
  
  
  await prisma.user.create({
    data:
      { 
        email: "admin@gmail.com",
        password: "admin"
      }
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
