import Home from './components/HelloWorld.vue'
import Fornecedores from './components/fornecedor/Fornecedores.vue'
import Fornecedor from './components/fornecedor/AddFornecedor.vue'
import Clientes from './components/cliente/Clientes.vue'
import Cliente from './components/cliente/AddCliente.vue'

export const routes = [ 
    {
        path: '', 
        components: {
            default: Home,
        },
        name: 'home'
    },
    {
        path: '/fornecedores',
        name: 'fornecedor',
        components:{
            default: Fornecedores,
        },
        children: [
            // {path: '/adicionar', component: AddFornecedor},
            // {path: ':id', component: UserDetail},
            // {path: ':id/edit', component: UserEdit, name: 'editUser'},
        ] 
    },
    {
        path: '/fornecedores/adicionar', 
        name: 'addfornecedor',
        component: Fornecedor,
    },
    {
        path: '/fornecedores/editar', 
        name: 'editfornecedor',
        component: Fornecedor,
    },
    {
        path: '/clientes',
        name: 'cliente',
        component: Clientes,
    },
    {
        path: '/clientes/adicionar',
        name: 'addcliente',
        component: Cliente,
    },
    {
        path: '/clientes/editar', 
        name: 'editcliente',
        component: Cliente,
    },
    {
        path: '*', redirect: { name: 'home'}
    }
]