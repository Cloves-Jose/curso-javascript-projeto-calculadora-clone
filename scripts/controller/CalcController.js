class CalcController {

    constructor() {
        //Manipulando a DOM atraves do ID da tag HTML que é usado pelo CSS
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._currentDate;
        this._locale = 'pt-BR'
        this.initialize();
        this.initButtonsEvents();
    }

    /**
     * Este método contera tudo o que deve ser inicializado 
     * assim que a página da calculadora for aberta.
     */
    initialize() {
        //Realiza a exibição assim que entrar na página
        this.setDisplayDateTime();
        //Executa uma função com um determinado intervalo de tempo em ms. para atualizar a hora e a data
        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);
    }

    /**
     * Vai receber todos os eventos de click do mouse
     */
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn);
        })
    }

    /**
     * Adiciona os eventos aos botões da calculadora
     */
    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        //Percorrer todos os botões
        buttons.forEach((btn, index) => {
            
            this.addEventListenerAll(btn, 'click drag', e => {

                console.log(btn.className.baseVal.replace("btn-",""));
            })

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";
            })
        })

    }

    /**
     * Captura data e hora de acordo com o país selecionado.
     */
    setDisplayDateTime() {
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        //Vai atribuir um valor no formato HTML para cada id selecionado
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        //Vai atribuir um valor no formato HTML para cada id selecionado
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        //Vai atribuir um valor no formato HTML para cada id selecionado
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}