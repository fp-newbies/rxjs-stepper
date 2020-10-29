import { from, fromEvent, Observable, of } from 'rxjs'
import { map, tap, filter, share, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
    currentTarget: T
    target: Element    
}

const stepperEl = document.querySelector('#stepper') as HTMLElement
const allSteps = stepperEl.querySelectorAll<HTMLElement>('.step')
const allForms = stepperEl.querySelectorAll<HTMLFormElement>('form')
const nextButtonsEl = stepperEl.querySelectorAll<HTMLButtonElement>('button')

const currentStep$ = of(1)
    .pipe(
        share(),
    )


const allSteps$ = from(allSteps)
    // .pipe(
        // tap(element => element.hidden = false),
        // filter(element => +element.getAttribute('data-step') !== 1),
        // tap(element => element.hidden = true),
    // )

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
    .pipe(
        tap(e => e.preventDefault()),
    )

const activeStep$ = submitForm$
    .pipe(
        map(e => {
            const currentStep = Number(e.currentTarget.getAttribute('data-step'))
            return currentStep < allSteps.length ? currentStep + 1 : currentStep
        }),
        switchMap(nextStep => allSteps$.pipe(
            filter(element => +element.getAttribute('data-step') !== nextStep),
            tap((_) => {
                debugger
            })
        ))
    )

allSteps$.subscribe(element => element.hidden = true)
activeStep$.subscribe(element => element.hidden = false)
// showingStep$.subscribe(console.log);
submitForm$.subscribe(console.log);
