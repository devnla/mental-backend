<?php

namespace App\Http\Requests\API;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateCoachProfileRequest extends FormRequest
{
    use ApiResponse;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'avatar' => ['nullable', 'string', 'max:500'],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['string', 'max:100'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string', 'max:150'],
            'badges' => ['nullable', 'array'],
            'badges.*' => ['string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0', 'max:9999.99'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'is_available' => ['nullable', 'boolean'],
            'availability_schedule' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'phone.max' => 'Phone number cannot exceed 50 characters.',
            'bio.max' => 'Bio cannot exceed 2000 characters.',
            'specialties.array' => 'Specialties must be an array.',
            'certifications.array' => 'Certifications must be an array.',
            'badges.array' => 'Badges must be an array.',
            'languages.array' => 'Languages must be an array.',
            'years_of_experience.integer' => 'Years of experience must be a number.',
            'years_of_experience.min' => 'Years of experience cannot be negative.',
            'hourly_rate.numeric' => 'Hourly rate must be a number.',
            'hourly_rate.min' => 'Hourly rate cannot be negative.',
            'availability_schedule.array' => 'Availability schedule must be an array.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            $this->validationErrorResponse(
                errors: $validator->errors()->toArray(),
                message: 'Coach profile update validation failed'
            )
        );
    }
}
