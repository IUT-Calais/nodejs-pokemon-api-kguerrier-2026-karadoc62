import type {Request, Response} from 'express';
import prisma from '../client.js'


export const getPokemonCards = async (_req: Request, res: Response) => {
    const pokemonCards = await prisma.pokemonCard.findMany();
    res.status(200).send(pokemonCards);
}

export const getPokemonCardById = async (req: Request, res: Response) => {
    const pokemonCardId = req.params.pokemonCardId;

    try{
        const pokemonCard = await prisma.pokemonCard.findUnique({
            where: {id: Number(pokemonCardId)},
        });
        if (!pokemonCard){
            res.status(404).send("Pokémon non trouvé");
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
            typeName,
            size,
            weight,
            imageUrl
        } = req.body;
    try{
        

       // TODO GESTION ERREURS

        const pokemon = await prisma.pokemonCard.create({
            data : {
                name,
                pokedexId,
                lifePoints,
                size,
                weight,
                imageUrl,
                type: {connect: {name: typeName}}
            }
        });
        res.status(201).send(pokemon);
    }
    catch (error: any){
        console.log("CREATE ERROR =>", error);
        res.status(500).send({
            error: "Une erreur est survenue",
            details: error?.message,
            code: error?.code
        });
    }
}

export const updatePokemonCard = async (req: Request, res: Response) => {
    const pokemonCardId = req.params.pokemonCardId;
    
    const {
            name,
            pokedexId,
            lifePoints,
            typeName,
            size,
            weight,
            imageUrl
        } = req.body;
    
    try{
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
                        connect: {name: typeName}
                    }
                }
            }
        );

        res.status(200).send(pokemon);
    }
    catch (error: any){
        console.log("CREATE ERROR =>", error);
        res.status(500).send({
            error: "Une erreur est survenue",
            details: error?.message,
            code: error?.code
        });
    }
    
};

export const deletePokemonCard = async (req: Request, res: Response) => {
    const pokemonCardId = req.params.pokemonCardId;

    try{
        const pokemon = await prisma.pokemonCard.delete(
            {
                where: {
                    id: Number(pokemonCardId)
                }
            }
        );
        res.status(200).send(pokemon);
    }
    catch(error){
        res.status(500).send({error: "Une erreur est survenue"});
    }
};