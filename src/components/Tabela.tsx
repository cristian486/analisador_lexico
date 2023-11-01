import React from "react";
import styles from './Tabela.module.css';
import { IEstado } from "../types/IEstado";


interface IProps {
    estados: IEstado[];
    possiveisEstados: IEstado[];
    error: boolean;
}

const Tabela = ({estados, possiveisEstados, error}: IProps) => {
    const alfabeto = ['simb','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    function montarLinhar() {
        let linhas: JSX.Element[] = [];
        estados.forEach(estadoInicial => {
            let estado = estadoInicial;
            estado = percorrerEstado(estado, linhas);
        });

        return linhas;
    }

    function percorrerEstado(estado: IEstado, linhas: JSX.Element[]) {
        while(estado.proximo !== null || estado.final) {

            let letraAtual = possiveisEstados!.filter(e => e.letra === estado.letra && e.indice === estado.indice).at(0);

            linhas.push(
                <tr key={estado.indice} style={{backgroundColor: error ? 'rgba(255, 0, 0, .7)': ''}}>
                    { mapearEstadoParaLinha(estado, letraAtual) }
                </tr>
            );


            if(estado.final) break;
            estado = estado.proximo!;
        }

        return estado;
    }

    function mapearEstadoParaLinha(estado: IEstado, letraAtual?:IEstado) {
        return alfabeto.map((l, i) => {
            

            let simb = estado.inicial ? '>' : estado.final ? '*' : '';

            if(l === 'simb')
                return(<td key={estado.letra}> {simb} {estado.letra} </td>);
            
            if(l === estado.letra) 
                return(<td key={estado.indice} style={{backgroundColor: letraAtual != null ? 'green' : ''}}> {estado.indice} </td>);

                
            
            return (<td key={i}> - </td>);
        });
    }

    return(
        <div className={styles.container}>
            <section className={styles.tabelaContent}>
                <table className={styles.tabela}>
                    <thead className={styles.thead}>
                        <tr>
                            {alfabeto.map((l, i) => <th key={i}>{l}</th>)}
                        </tr>
                    </thead>


                    <tbody className={styles.tbody}>
                        {montarLinhar()}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default Tabela;