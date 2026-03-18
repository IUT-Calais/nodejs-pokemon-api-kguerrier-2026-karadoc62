import type {Request, Response} from 'express';
import prisma from '../client'


export const getPokemonCards = async (_req: Request, res: Response) => {
    try{
        const pokemonCards = await prisma.pokemonCard.findMany();
        res.status(200).send(pokemonCards);
    }
    catch(error){
        res.status(500).send({error : "Une erreur est survenue"});
    }
}

export const getPokemonCardById = async (req: Request, res: Response) => {
    const pokemonCardId = req.params.pokemonCardId;

    try{
        const pokemonCard = await prisma.pokemonCard.findUnique({
            where: {id: Number(pokemonCardId)},
        });
        if (!pokemonCard){
            res.status(404).send({error: "Pokémon non trouvé"});
            return
        }
        res.status(200).send(pokemonCard);
    }
    catch (error){
        res.status(500).send({error : "Une erreur est survenue"});
    }
}

export const createPokemonCard = async (req: Request, res: Response) => {
    const {
            name,
            pokedexId,
            lifePoints,
            type,
            size,
            weight,
            imageUrl
        } = req.body;
    try{
        // Tests des champs obkigatoires
        if (!name || name.trim() === ""){
            res.status(400).send({error: "Le nom est obligatoire"});
            return
        }
        if (!pokedexId){
            res.status(400).send({error: "L'id du pokédex est obligatoire"});
            return
        }
        if (!lifePoints){
            res.status(400).send({error: "Le nombre de points de vie est obligatoire"});
            return
        }
        if (!type){
            res.status(400).send({error: "Le type du pokémon est obligatoire"});
            return
        }

        // test si type est dans la liste
        const typeExist = await prisma.type.findUnique(
            {
                where: {id: Number(type)}
            }
        );
        if (!typeExist){
            res.status(400).send({error: "Le type n'existe pas"});
            return
        }

        // test de doublon sur le nom
        const nameExist = await prisma.pokemonCard.findUnique(
            {where: {name}}
        );
        if (nameExist){
            res.status(400).send({error: "Le nom de pokémon existe déjà"});
            return
        }
        
        // test de doublon sur le pokedexId
        const pokedexIdExist = await prisma.pokemonCard.findUnique(
            {
                where: {pokedexId}
            }
        );
        if (pokedexIdExist){
            res.status(400).send({error: "Le numéro de pokédex existe déjà"});
            return
        }

        // tout est ok on continue
    
        const pokemon = await prisma.pokemonCard.create({
            data : {
                name,
                pokedexId,
                lifePoints,
                size,
                weight,
                imageUrl,
                type: {connect: {id: Number(type)}}
            }
        });
        res.status(201).send(pokemon);
    }
    catch (error){
        console.error("Erreur createPokemonCard :", error);
        res.status(500).send({error : "Une erreur est survenue"});
        return
    }
}

export const updatePokemonCard = async (req: Request, res: Response) => {
    const pokemonCardId = Number(req.params.pokemonCardId);

    const {
            name,
            pokedexId,
            lifePoints,
            type,
            size,
            weight,
            imageUrl
        } = req.body;
  
    try{
        // test que le pokemon a cet id existe
        const pokemonCardIdExist = await prisma.pokemonCard.findUnique(
            {where: {id: Number(pokemonCardId) }}
        )
        if (!pokemonCardIdExist){
            res.status(404).send({error: "Le pokémon n'existe pas"});
            return
        }

        // Tests des champs obkigatoires
        if (!name || name.trim() === ""){
            res.status(400).send({error: "Le nom est obligatoire"});
            return
        }
        if (!pokedexId){
            res.status(400).send({error: "L'id du pokédex est obligatoire"});
            return
        }
        if (!lifePoints){
            res.status(400).send({error: "Le nombre de points de vie est obligatoire"});
            return
        }
        if (!type){
            res.status(400).send({error: "Le type du pokémon est obligatoire"});
            return
        }

        // test si type est dans la liste
        const typeExist = await prisma.type.findUnique({
            where: { id: Number(type) }
        });
        if (!typeExist){
            res.status(400).send({error: "Le type n'existe pas"});
            return
        }

        // test de doublon sur le nom
        const nameExist = await prisma.pokemonCard.findFirst(
            {where: {
                name,
                id: {not: pokemonCardId}
            }}
        );
        if (nameExist){
            res.status(400).send({error: "Le nom de pokémon existe déjà"});
            return
        }
        
        // test de doublon sur le pokedexId
        const pokedexIdExist = await prisma.pokemonCard.findFirst(
            {
                where: {
                    pokedexId,
                    id: {not: pokemonCardId}
                }
            }
        );
        if (pokedexIdExist){
            res.status(400).send({error: "Le numéro de pokédex existe déjà"});
            return
        }

        
        const pokemon = await prisma.pokemonCard.update(
            {
                where: {
                    id: Number(pokemonCardId)
                },
                data: {
                    name,
                    pokedexId,
                    lifePoints,
                    size,
                    weight,
                    imageUrl,
                    type:{
                        connect: {id: Number(type)}
                    }
                }
            }
        );
        res.status(200).send(pokemon);
    }
    catch (error){
        res.status(500).send({error : "Une erreur est survenue"});
    }
};


export const deletePokemonCard = async (req: Request, res: Response) => {
    const pokemonCardId = req.params.pokemonCardId;

    try{
        // test que le pokemon a cet id existe
        const pokemonCardIdExist = await prisma.pokemonCard.findUnique(
            {where: {id: Number(pokemonCardId) }}
        )
        if (!pokemonCardIdExist){
            res.status(404).send({error: "Le pokémon n'existe pas"});
            return
        }
        
        const pokemon = await prisma.pokemonCard.delete(
            {
                where: {
                    id: Number(pokemonCardId)
                }
            }
        );
        res.status(204).send();
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
};