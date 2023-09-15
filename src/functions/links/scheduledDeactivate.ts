import linkService from "../../services/linkService";

export const handlerFunc = async (event: any): Promise<any> => {
    try {
        const deactivatedLink = await linkService.deactivateLink(event.shortedLink, event.user);
    } catch(err) {
        console.log(err);
    }
    
}