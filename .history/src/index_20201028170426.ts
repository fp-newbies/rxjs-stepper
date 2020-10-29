import { from, fromEvent } from 'rxjs'
import { map, tap, filter, find, switchMap, publishBehavior } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLElement>('#stepper .step')
const allForms = document.querySelectorAll<HTMLFormElement>('#stepper form')

const allSteps$ = from(allSteps)

const mountApp$ = fromEvent(document, 'DOMContentLoaded')

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const nextStep$ = submitForm$
  .pipe(
    map(e => {
      const currentStep = Number(e.currentTarget.getAttribute('data-step'))
      const nextStep = currentStep < allSteps.length ? currentStep + 1 : currentStep
      return nextStep
    }),
    publishBehavior(1),
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

// mountApp$.subscribe(() => {
//   allSteps
//   allSteps[0].hidden = false
// })
// stepper$.subscribe(element => element.hidden = false)
// nextStep$.subscribe((v) => console.log('nextStep', v))
hiddenSteps$.subscribe((stepElement) => {
  console.log('hiddenSteps', stepElement)
  stepElement.hidden = true
})
visibleSteps$.subscribe((stepElement) => {
  console.log('visibleSteps', stepElement)
  stepElement.hidden = false
})
submitForm$.subscribe((v) => console.log('submitForm', v));
