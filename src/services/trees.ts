import { TreesResponse } from "../types/treesResponse";

const getTrees = (): Promise<TreesResponse> => 
    new Promise((resolve, reject) => {
        fetch('https://x.api.ecologi.com/trees')
            .then((res) => res.json())
            .then(result => resolve(result))
            .catch(err => reject(err))
    });

export {
    getTrees
}