const btnLogin = document.getElementById("btnLogin");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const API_BASE = "https://api-colombia.com/api/v1";
const departmentSelect = document.getElementById("departments");
const citySelect = document.getElementById("cities");

// simulacion de la base de datos


//validacion de promesa

function validarNumero(numero){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const regexSoloNumeros = /^[0-9]+$/;
            if(numero.length !== 10){
                reject("su numero de telefono no es numero valido");
            }else if(!regexSoloNumeros.test(numero)){
                reject("por favor solo ingresa numeros")
            }else{
                resolve("numero verificado");
            }

        },1500)
    })
}

function validarCodigo(codigo){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
           const regexSoloNumeros = /^[0-9]+$/;
            if(codigo.length !==5){
                reject("el formato de su codigo no es valido(5 numeros)")
            }else if(!regexSoloNumeros.test(codigo)){
                reject("por favor solo ingresa numeros")
            }else{
                resolve("codigo verificado")
            }
        })
    })
}

function validarIdentificacion(numero2){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
           const regexSoloNumeros = /^[0-9]+$/;
            if(numero2.length !==10){
                reject("Numero de identificacion no valido.(10 nuemeros)")
            }else if(!regexSoloNumeros.test(numero2)){
                reject("por favor solo ingresa numeros")
            }else{
                resolve("codigo verificado")
            }
        },1000);
    })
}

function validarSangre(sangre) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tiposValidos = ["A+", "A-", "O+", "O-", "B+", "B-", "AB+", "AB-"];

      if (!tiposValidos.includes(sangre)) {
        reject("Formato de sangre no existe (escriba en mayúscula)");
      } else {
        resolve("Tipo de sangre verificado");
      }
    }, 1000); 
  });
}



function validarEmail(email){
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!regex.test(email)){
                reject("formato de correo no validado");
            
            }else{
                resolve("email verificado");
            }
        },1800)
    })
}






btnLogin.addEventListener("click",()=>{
    resultado.textContent = "";
    resultado.className = "";
    estado.textContent = "";

    //obtener los valores del formulario

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const codigo= document.getElementById("Codigo").value.trim();
    const documento = document.getElementById("documento").value.trim();
    const grado= document.getElementById("Grado").value.trim();
    const sangre = document.getElementById("sangre").value.trim();
    const numero2 = document.getElementById("numero2").value.trim();
    const fecha = document.getElementById("Fecha").value.trim();
    const departamentos = document.getElementById("departments").value.trim();
    const ciudades = document.getElementById("cities").value.trim();
    

   


    // validar que todos los campos esten llenos

    if(!nombre || !apellidos || !email || !numero || !codigo || !documento || !grado || !sangre || !numero2
        || !fecha || !departamentos  || !ciudades){  
      
        resultado.className = "error";
        resultado.textContent = "Todos los campos son obligatorios"
        estado.textContent = "Por favor completa todos los campos"
        return;
    }

    estado.textContent = "verificando credenciales"

    Promise.all([
        validarNumero(numero),
        validarSangre(sangre),
        validarEmail(email),
        validarCodigo(codigo),
        validarIdentificacion(numero2)

    ])

    .then(([resNumero, resEmail,resSangre,resCodigo,resIdentificacion])=>{
        resultado.className = "success"
        resultado.innerHTML=`Su registro ha sido un exito`;
    })

    .catch((error)=>{
        resultado.className = "error";
        resultado.textContent = " ERROR:"+error;
        estado.textContent = "error en el inicio de sesión";
    })

    .finally(()=>{
        console.log("proceso de autenticacion finalizado");
    })

})

async function loadDepartments() {
    const res = await fetch(`${API_BASE}/Department`);
    const departments = await res.json();
    
    

    departmentSelect.innerHTML = `<option value="">-- Seleccione un departamento --</option>`;
    departments.forEach(dep => {
      const option = document.createElement("option");
      option.value = dep.id;
      option.textContent = dep.name;
      departmentSelect.appendChild(option);
    });

    
  }

 


async function loadCitiesByDepartment(departmentId) {
  try {
    const res = await fetch(`${API_BASE}/Department/${departmentId}/cities`);
    const cities = await res.json();

    citySelect.innerHTML = `<option value="">-- Seleccione una ciudad --</option>`;

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });

    citySelect.disabled = false;

  } catch (error) {
    console.error("Error cargando ciudades:", error);
    citySelect.innerHTML = `<option value="">Error al cargar ciudades</option>`;
    citySelect.disabled = true;
  }
}


departmentSelect.addEventListener("change", () => {
  const selectedId = departmentSelect.value;
  if (selectedId) {
    loadCitiesByDepartment(selectedId);
  } else {
    citySelect.innerHTML = `<option value="">-- Seleccione una ciudad --</option>`;
    citySelect.disabled = true;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  loadDepartments();
});

 