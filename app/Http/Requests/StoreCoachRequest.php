<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreCoachRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:coaches,email'],
            'avatar' => ['nullable', File::image()->max(1024)], // 1MB max
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
