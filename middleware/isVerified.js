export default function ({store, error}) {

    if (store.$auth.user.domain === 'Locum')  {
        if(store.$auth.user.status !== "Active" && store.$auth.user.status !== "Dormant" ){
            error({ statusCode: 401, message: 'Your Locum is Not Authorized'})
        }    
    } 

    if (store.$auth.user.domain === 'Practice' && store.$auth.user.status !== "Active") {
       error({ statusCode: 401, message: 'Your Practice is Not Authorized'})    
    } 
   
}
