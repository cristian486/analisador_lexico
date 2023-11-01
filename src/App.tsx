import React, { useState } from 'react';
import style from './App.module.css';
import { IEstado } from './types/IEstado';
import Tabela from './components/Tabela';
import IdGenerator from './utils/IdGenerator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [error, setError] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [palavra, setPalavra] = useState<string>('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [listaDeEstados, setListaDeEstados] = useState<IEstado[]>([]);
  const [listaDePossiveisEstados, setListaDePossiveisEstados] = useState<IEstado[]>([]);

  function handleTokenKeyPressed(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;

    if(tokens.indexOf(token) > -1) {
      alert('Não é possível cadastrar o mesmo token duas vezes');
      setToken('');
      return;
    }

    let estado : IEstado = {indice: `q${IdGenerator.getId()}`, letra: token.at(0) || '', inicial: true, final: false, proximo: null, anterior: null};
    estado = createTokenEstado(estado);

    const listaDeTokensOrdenada = [...listaDeEstados, estado].sort((a, b) => a.indice > b.indice ? 1 : -1); // < 0 then a,b | > 0 then b,a

    setListaDeEstados(listaDeTokensOrdenada);
    setTokens([...tokens, token].sort((a, b) => a > b ? 1 : -1));
    setToken('');
    setPalavra('');
    setListaDePossiveisEstados([]);
  }


  function createTokenEstado(estado: IEstado) {
    let estadoInicial = estado;

    for(let i = 1; i < token.length; i++) {
      while(estado.proximo !== null) {
        estado = estado.proximo!;
      }
      
      estado.proximo = {indice: `q${IdGenerator.getId()}`, letra: token.at(i) || '', inicial: false, final: (i + 1) === token.length, proximo: null, anterior: estado};
    }

    return estadoInicial;
  }

  
  function handleOnChangePalavra(newValue: string) {
    let palavraAntesDoUpdate = palavra;
    setPalavra(newValue);

    let possiveisEstados :IEstado[] = [];
    let posicaoDaLetraDigitada = newValue.length - 1;
    let ultimaLetraDigitada = newValue[posicaoDaLetraDigitada];

    if(ultimaLetraDigitada === ' ') {
      validarPalavraAposTermino();
      return;
    }

    if(posicaoDaLetraDigitada < 0) {
      setError(false);
      setListaDePossiveisEstados([]);
      return;

    } else if(posicaoDaLetraDigitada  === 0) {

      possiveisEstados = listaDeEstados.filter(e => e.inicial && e.letra === ultimaLetraDigitada);

    } else if(palavraAntesDoUpdate > newValue) {

      listaDeEstados.forEach(estado => {
          let estadoTemp = estado;

          for(let i = 0; i < newValue.length - 1; i++) {
            if(estadoTemp.proximo != null && estadoTemp.letra === newValue.at(i)) estadoTemp = estadoTemp.proximo;
          }

          if(estadoTemp.letra === ultimaLetraDigitada)
            possiveisEstados.push(estadoTemp);
      });

      
    } else {

      possiveisEstados = listaDePossiveisEstados.filter(e => e.proximo?.letra === ultimaLetraDigitada).map(e => e.proximo!);

    }

    if(possiveisEstados.length === 0 && newValue.length > 0) setError(true);
    else if(possiveisEstados.length > 0) setError(false);

    setListaDePossiveisEstados(possiveisEstados);
  }

  function validarPalavraAposTermino() {
      if(listaDePossiveisEstados.length === 0) {
        palavraInvalida();
      } else if(listaDePossiveisEstados.length > 1) {
        let algumEstadoFinal = listaDePossiveisEstados.filter(e => e.final);

        if(algumEstadoFinal.length === 1) {
          palavraValida();
        } else {
          palavraInvalida();
        }

      } else {
        if(listaDePossiveisEstados.at(0)?.final)
          palavraValida();
        else
        palavraInvalida();
      }


      setPalavra('');
      setListaDePossiveisEstados([]);
  }

  function palavraInvalida() {
    toast.error('Palavra não é válida!', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }

  function palavraValida() {
    toast.success('Palavra é válida!', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }

  function removerToken(tok: string) {
    const novaListaDeTokens = tokens.filter(t => t !== tok);
    setTokens(novaListaDeTokens);
    setToken('');
    setPalavra('');
    setListaDePossiveisEstados([]);

    
    let possiveisEstadosIniciais = listaDeEstados.filter(e => e.inicial && e.letra === tok.at(0));

    for(const estado of possiveisEstadosIniciais) {
      let estadoTemp : IEstado | null = estado;

      for(let i = 0; i < tok.length; i++) {
        if(estadoTemp.proximo !== null && estadoTemp.letra === tok.at(i))
          estadoTemp = estadoTemp.proximo;
        else if(estadoTemp.proximo === null && estadoTemp.letra === tok.at(i) && (i + 1) === tok.length && estadoTemp.final)
          break;
        else {
          estadoTemp = null;
          break;
        }
      }

      if(estadoTemp !== null) {
        while(estadoTemp.anterior !== null) estadoTemp = estadoTemp.anterior;
        const novaListaDeEstados = listaDeEstados.filter(e => e.indice !== estadoTemp?.indice);
        setListaDeEstados(novaListaDeEstados);
      }
    }

    
  }

  return (
    <main className={style.defaultLayout}>
      <div className={style.tokensDisplay}> 
        <h2>Tokens</h2>
        <ToastContainer/>
        { 
        
          tokens
            .map(tok =>  
              <div key={tok}>
                {tok}
                <FontAwesomeIcon className={style.inputDisplayIcon} icon={faX} onClick={() => removerToken(tok)}/>
              </div>
            )
        } 
      </div>
      <div>
        <div className={style.inputDisplay}>
          <input type="text" name="token" value={token} onChange={e => setToken(e.target.value.toLocaleLowerCase().replace(/[^a-zA-Z]/gi, ''))} onKeyDown={e => handleTokenKeyPressed(e)} placeholder='Insira o token (a...z)'/>
        </div>
        
        <div className={style.inputDisplay}>
          <input type="text" name="token" value={palavra} onChange={e => handleOnChangePalavra(e.target.value.toLocaleLowerCase().replace(/[^a-zA-Z' ']/g, ''))} placeholder='Insira a palavra que deseja verificar'/>
        </div>

        <Tabela estados={listaDeEstados} possiveisEstados={listaDePossiveisEstados} error={error}/>
      </div>
    </main>
  );
}

export default App;
