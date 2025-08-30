# Gram Panchayat Website - Frontend

A modern, responsive web application for Gram Panchayat services with enhanced certificate application forms and AWS integration.

## 🚀 New Features

### Enhanced Application Forms
- **Professional UI/UX**: Modern, mobile-friendly design with smooth animations
- **AWS File Upload**: Secure file upload to AWS S3 with drag & drop support
- **Form Validation**: Real-time validation with error handling
- **Responsive Design**: Optimized for all device sizes
- **TypeScript**: Full TypeScript support for better development experience

### Certificate Types Supported
1. **Birth Certificate** - Complete application form with parent details
2. **Death Certificate** - Comprehensive deceased person information
3. **Marriage Certificate** - Bride and groom details with ceremony information

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Icons** for iconography
- **Vite** for build tooling

## 📱 Features

### Form Components
- **InputField**: Enhanced input with validation and error display
- **TextareaField**: Multi-line text input with character limits
- **SelectField**: Dropdown selection with custom options
- **FileUploadField**: Drag & drop file upload with AWS integration
- **SubmitButton**: Loading states and variants
- **FormSection**: Organized form sections with descriptions

### File Upload Features
- Drag & drop file upload
- Multiple file selection (max 5 files)
- File size validation (max 10MB per file)
- Supported formats: JPG, PNG, PDF, DOC, DOCX
- Real-time upload progress
- File preview with remove functionality

### Validation & Error Handling
- Real-time field validation
- Custom error messages
- Form submission validation
- API error handling
- User-friendly error display

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📁 Project Structure

```
src/
├── components/
│   └── FormComponents.tsx     # Shared form components
├── pages/
│   ├── applyforcertificates.tsx    # Certificate selection page
│   ├── BirthCertificate.tsx        # Birth certificate form
│   ├── DeathCertificate.tsx        # Death certificate form
│   ├── MarriageCertificateForm.tsx # Marriage certificate form
│   └── FormDetails.tsx             # Application details view
├── api/
│   └── axios.ts              # API configuration
└── types/                    # TypeScript type definitions
```

## 🔧 Usage

### Using Form Components

```tsx
import { InputField, FileUploadField, SubmitButton } from '../components/FormComponents';

// Basic input field
<InputField
  label="Full Name"
  name="fullName"
  placeholder="Enter your full name"
  required={true}
  error={errors.fullName}
/>

// File upload field
<FileUploadField
  label="Documents"
  name="documents"
  multiple={true}
  maxFiles={5}
  maxSize={10}
  acceptedTypes={[".jpg", ".png", ".pdf"]}
  onFilesChange={handleFilesChange}
  required={true}
/>

// Submit button
<SubmitButton
  loading={loading}
  variant="primary"
  size="lg"
>
  Submit Application
</SubmitButton>
```

### Form Validation

```tsx
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  // Required field validation
  Object.keys(formData).forEach(key => {
    if (!formData[key as keyof FormData]) {
      newErrors[key] = "This field is required";
    }
  });

  // Custom validations
  if (formData.age && Number(formData.age) < 18) {
    newErrors.age = "Age must be at least 18 years";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 🎨 Styling

The application uses Tailwind CSS with custom components. Key design features:

- **Responsive Grid**: Mobile-first responsive design
- **Color Schemes**: Theme-specific colors for each certificate type
- **Animations**: Smooth transitions and hover effects
- **Typography**: Consistent font hierarchy and spacing
- **Shadows**: Subtle depth and elevation

## 📱 Mobile Responsiveness

- Responsive grid layouts
- Touch-friendly form controls
- Mobile-optimized file upload
- Adaptive spacing and typography
- Touch gestures support

## 🔒 Security Features

- File type validation
- File size limits
- Secure file upload to AWS S3
- Form data sanitization
- API authentication

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build
```bash
# Build the project
npm run build

# Serve the dist folder
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This frontend application is designed to work with the corresponding backend API that handles AWS S3 integration and certificate processing.
