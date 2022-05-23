import { merge, Observable, of } from 'rxjs';
import { scan } from 'rxjs/operators';

interface myInterface {
  id: number,
  title: string
}

interface myInterface {
  id: number
}

interface BOO {
  id: number
}

export class TestService {

  originalArrayObservable$: Observable<myInterface[]> = of([{id:1,title:'test1'},{id:2,title:'test2'}]);
  observableToMerge$: Observable<myInterface> = of({id:3,title:'test3'});

  modifiedArray$ = merge(
    this.originalArrayObservable$,
    this.observableToMerge$
  )
    .pipe(
      // "scan" outputs as VERSUS documentation:

      // scan<myInterface, myInterface[]>(accumulator: (acc: myInterface[], value: myInterface, index: number) => myInterface[]): OperatorFunction<...> 
      // scan<V, A, S>(accumulator: (acc: V | A | S, value: V, index: number) => A, seed?: S): OperatorFunction<V, V | A>

      // errors to :
      // Argument of type 'OperatorFunction<myInterface, myInterface[]>' is not assignable to parameter of type 'OperatorFunction<myInterface | myInterface[], myInterface[]>'.
      // Argument of type 'OperatorFunction<myInterface, BOO[]>' is not assignable to parameter of type 'OperatorFunction<myInterface | myInterface[], BOO[]>'.

      // scan<AHH, BOO[]>(accumulator: (acc: BOO[], value: AHH, index: number) => BOO[]): OperatorFunction<AHH, BOO[]>
      // Argument of type 'OperatorFunction<AHH, BOO[]>' is not assignable to parameter of type 'OperatorFunction<myInterface | myInterface[], BOO[]>'.

      // @ts-ignore
      scan<myInterface, myInterface[]>((acc: myInterface[], value: myInterface) => [...acc, value])
    );   

}