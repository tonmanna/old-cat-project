import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AddressService, IAddress } from '../address.service';

interface filedType {
  value: string;
  field: string;
  label: string;
  validator: Validators[];
  errorMessage: string;
}
@Component({
  selector: 'code-cat-display-address',
  templateUrl: './display-address.component.html',
  styleUrls: ['./display-address.component.scss'],
})
export class DisplayAddressComponent implements OnInit, OnDestroy {
  constructor(
    private parentFormDirective: FormGroupDirective,
    private form: FormBuilder,
    private addressService: AddressService
  ) {}

  fields = [
    {
      value: '',
      field: 'z',
      label: 'POSTCODE',
      validator: [Validators.required],
      errorMessage: '',
    },
    {
      value: '',
      field: 'd',
      label: 'DISTRICT',
      validator: [Validators.required],
      errorMessage: '',
    },
    {
      value: '',
      field: 'a',
      label: 'CITY',
      validator: [Validators.required],
      errorMessage: '',
    },
    {
      value: '',
      field: 'p',
      label: 'PROVINCE',
      validator: [Validators.required],
      errorMessage: '',
    },
  ] as filedType[];

  getAddressForm: FormGroup;
  filteredOptions: IAddress[];
  parentForm: FormGroup;
  destroy$ = new Subject();

  amphoeError: string;

  ngOnInit() {
    const newForm = this.propsToForm(this.fields);
    this.getAddressForm = this.form.group(newForm);
    this.getAddressForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => this._filter(value));
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('location', this.getAddressForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  propsToForm(props) {
    return props.reduce(
      (acc, { field, value, validator }) => ({
        ...acc,
        ...{ [field]: [value, validator] },
      }),
      {}
    );
  }

  selectSuggestion(value) {
    this.getAddressForm.setValue(value);
  }

  _filter(value: IAddress) {
    const destroy$ = new Subject();
    this.addressService
      .resolveResultbyField(value)
      .pipe(takeUntil(destroy$))
      .subscribe((result) => {
        this.filteredOptions = result;
        destroy$.next();
        destroy$.complete();
      });
  }
}
