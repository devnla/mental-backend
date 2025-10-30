<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateCoachRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('coaches', 'email')->ignore($this->coach),
            ],
            'avatar' => ['nullable', File::image()->max(1024)], // 1MB max
            'remove_avatar' => ['nullable', 'boolean'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['string', 'max:255'],
            'badges' => ['nullable', 'array'],
            'badges.*' => ['string', 'max:255'],
            'language' => ['required', 'array', 'min:1'],
            'language.*' => ['string', 'max:255'],
        ];
    }
}
