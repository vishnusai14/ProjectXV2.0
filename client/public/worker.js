
self.addEventListener("push" , (e) => {/* eslint-disable-line no-restricted-globals */
    const option = {
        body : "Hello From Sw"
    }
    self.clients.matchAll({type : "window"})/* eslint-disable-line no-restricted-globals */
    .then((res) => {
        console.log(res[0])
        if(res[0] === undefined) {
            console.log("Yes")
            e.waitUntill(
                self.registration.showNotification("Hello" , option)/* eslint-disable-line no-restricted-globals */
            )
        
        }
      
        
    })
    .catch((err) => {
        console.log(err)
    })
 
    
})