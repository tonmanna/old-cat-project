import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AddressService, IAddress } from '../address.service';
@Component({
  selector: 'code-cat-display-address',
  templateUrl: './display-address.component.html',
  styleUrls: ['./display-address.component.scss'],
})
export class DisplayAddressComponent implements OnInit, OnChanges, OnDestroy {
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
      validator: [],
      errorMessage: '',
    },
    {
      value: '',
      field: 'd',
      label: 'DISTRICT',
      validator: [],
      errorMessage: '',
    },
    {
      value: '',
      field: 'a',
      label: 'CITY',
      validator: [],
      errorMessage: '',
    },
    {
      value: '',
      field: 'p',
      label: 'PROVINCE',
      validator: [],
      errorMessage: '',
    },
  ];

  @ViewChild('addressBox') addressBox: ElementRef;
  @Output() handleValue: EventEmitter<any> = new EventEmitter();

  getAddressForm: FormGroup;
  filteredOptions: IAddress[];
  selectedField;
  parentForm: FormGroup;
  dateNow;
  isSaveClickSubscription: Subscription;
  validationMessages = [
    {
      control: 'sub_district',
      rules: {
        required: 'amphoe is required',
        minlength: 'amphoe cannot be less than 5 character',
      },
    },
    {
      control: 'amphoe',
      rules: {
        required: 'district is required',
        minlength: 'district cannot be less than 5 character',
      },
    },
    {
      control: 'province',
      rules: {
        required: 'province is required',
        minlength: 'province cannot be less than 5 character',
      },
    },
    {
      control: 'post_code',
      rules: {
        required: 'post code is required',
        minlength: 'post code cannot be less than 5 character',
      },
    },
  ];

  amphoeError: string;

  ngOnInit() {
    const newForm = this.propsToForm(this.fields);
    this.getAddressForm = this.form.group(newForm);
    this.getAddressForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this._filter(value));

    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('location', this.getAddressForm);

    // this.isSaveClickSubscription = this.customerCommonService.getIsCustomerSaveClicked.subscribe(
    //   (value) => {
    //     if (value) {
    //       this.showAddressError();
    //     }
    //   }
    // );
  }

  showAddressError(): void {
    for (const field of this.fields) {
      const control = this.getAddressForm.get(field.field);
      const isRequired = this.getAddressForm.get(field.field).errors?.required;
      if (isRequired) {
        control.markAsTouched();
        control.markAsDirty();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isSaveClickSubscription)
      this.isSaveClickSubscription.unsubscribe();
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

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes?.fields;
    if (currentValue?.length) {
      const test = currentValue.reduce(
        (acc, { field, value }) => ({
          ...acc,
          ...{ [field]: value },
        }),
        {}
      );
      this?.parentForm?.patchValue(test);
    }
  }

  changeHandler(field) {
    this.selectedField = field;
    const customerFormControl = this.getAddressForm.get(field);
    customerFormControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.setErrorMessage(customerFormControl, field);
    });
  }

  setErrorMessage(c: any, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find(
        (validation) => validation.control === controlName
      );
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string) {
    this[`${controlName}ValidationMessage`] = errorMessage;
  }
  getString(field) {
    return this[field + 'ValidationMessage'];
  }
  selectSuggestion(value) {
    this.getAddressForm.setValue(value);
    this.handleValue.emit(value);
    this.addressBox.nativeElement.focus();
  }

  _filter(value: IAddress) {
    if (value[this.selectedField]?.length > 2) {
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
}
