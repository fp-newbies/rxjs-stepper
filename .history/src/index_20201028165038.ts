import { from, fromEvent } from 'rxjs'
import { map, tap, filter, find, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const stepperEl = document.querySelector('#stepper') as HTMLElement
const allSteps = stepperEl.querySelectorAll<HTMLElement>('.step')
const allForms = stepperEl.querySelectorAll<HTMLFormElement>('form')

const allSteps$ = from(allSteps)

const mountApp$ = fromEvent(document, 'DOMContentLoaded')

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault()),
  )

const nextStep$ = submitForm$
  .pipe(
    map(e => {
      const currentStep = Number(e.currentTarget.getAttribute('data-step'))
      const nextStep = currentStep < allSteps.length ? currentStep + 1 : currentStep
      console.log({nextStep})
      return nextStep
    }),
  )

const hiddenSteps$ = nextStep$.pipe(
  switchMap(nextStep =>
    allSteps$.pipe(
      filter(element => +element.getAttribute('data-step') !== nextStep),
    )
  ),
)

const visibleSteps$ = nextStep$.pipe(
  switchMap(nextStep =>
    allSteps$.pipe(
      find(element => +element.getAttribute('data-step') === nextStep),
    )
  ),
)

// allSteps$.subscribe(element => element.hidden = true)
// mountApp$.subscribe(() => allSteps[0].hidden = false)
// stepper$.subscribe(element => element.hidden = false)
nextStep$.subscribe()
hiddenSteps$.subscribe()
visibleSteps$.subscribe()
submitForm$.subscribe(console.log);
