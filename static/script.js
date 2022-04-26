tf.loadLayersModel("Model\\model.json").then(function (model) 
{
    window.model = model;
    console.log(window.model.summary);
});
async function run()
{
    const x1 = parseInt(document.getElementById("children").value);
    const x2 = parseInt(document.getElementById("category").value);
    const x3 = parseInt(document.getElementById("income").value);
    const x4 = parseInt(document.getElementById("car").value);
    const x5 = parseInt(document.getElementById("house").value);
    const x = [x1,x2,x3,x4,x5];
    const input = tf.tensor2d(x,[1,5]);
    var card_limit  = 0
    if(window.model)
    {
        console.log(model.summary());
        const y = model.predict(input);
        const values = y.dataSync();
        window.alert(values);
        if(values<0.5)
        {
            
            
            document.getElementById("res").innerHTML = "NOT APPROVED";
        }
        else 
        {
            if(x3>=20000 && x3<50000)
            {
                card_limit = 0.07*x3;
            }
            else if(x3>=10000 && x3<20000)
            {
                card_limit = 0.05*x3;
            }
            else if(x3>50000)
            {
                card_limit = "unlimited"
            }
            else
            {
                card_limit = 0.02*x3;
            }
            document.getElementById("res").innerHTML="<h1>Approved<br></h1>"+"<h1>Card limit:"+card_limit+"</h1>";
        }
    }
    else
    {
        console.log("Failed");
    }
}