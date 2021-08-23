export default class Form extends React.Component{
   state = {
      nombre: ''
   }

   nombre = e => {
      this.setState({nombre: e.target.value})
   }

   async componentDidMount(){
      // Aqui las funciones que quieres que se ejecuten sin necesidad de hacer click a un boton
   }

   render(){
      const {nombre} = this.state
      /*
            En el caso de necesitar enviar la informacion de un formulario a una funcion
            utilizar en el <form onSubmit={ (e) => this.funcionEjecutar(e) } >
      */
      return(
            <div>
               
               <form>
                  <input type="text" onChange={this.nombre}/>
               </form>
               <hr/>
               <p>Estas escribiendo: {nombre}</p>
            </div>
      )
   }
}