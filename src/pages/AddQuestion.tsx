import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDomains } from '../redux/slices/domainSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { addQuestion } from '../redux/slices/questionSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import {toast} from 'sonner'
import { X } from 'lucide-react';

const AddQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [domainId, setDomainId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation errors
  const [titleError, setTitleError] = useState('');
  const [domainError, setDomainError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [optionsError, setOptionsError] = useState('');
  const [correctOptionError, setCorrectOptionError] = useState('');
  
  const { domains } = useAppSelector(state => state.domains);
  const { categories } = useAppSelector(state => state.categories);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Filter categories by selected domain
  const filteredCategories = categories.filter(
    category => category.domainId === domainId
  );
  
  useEffect(() => {
    dispatch(fetchDomains());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setOptionsError('');
  };
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast('Error',{
   
        description: 'A question must have at least 2 options',
       
      });
      return;
    }
    
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    
    // Adjust correctOptionIndex if needed
    if (correctOptionIndex === index) {
      setCorrectOptionIndex(null);
    } else if (correctOptionIndex !== null && correctOptionIndex > index) {
      setCorrectOptionIndex(correctOptionIndex - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Question title is required');
      isValid = false;
    }
    
    if (!domainId) {
      setDomainError('Please select a domain');
      isValid = false;
    }
    
    if (!categoryId) {
      setCategoryError('Please select a category');
      isValid = false;
    }
    
    // Check if any option is empty
    if (options.some(option => !option.trim())) {
      setOptionsError('All options must have content');
      isValid = false;
    }
    
    if (correctOptionIndex === null) {
      setCorrectOptionError('Please select the correct answer');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(
        addQuestion({
          categoryId,
          title: title.trim(),
          options: options.map(opt => opt.trim()),
          correctOptionIndex: correctOptionIndex!,
        })
      ).unwrap();
      
      toast('Success',{
     
        description: 'Question created successfully!',
      });
      navigate('/');
    } catch (error) {
      toast('Error',{
      
        description: 'Failed to create question. Please try again.',
      
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
          <CardDescription>
            Create a new question under a category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain-select">Domain</Label>
              <Select 
                onValueChange={(value) => {
                  setDomainId(value);
                  setCategoryId(''); // Reset category when domain changes
                  setDomainError('');
                }}
              >
                <SelectTrigger className={domainError ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.length === 0 ? (
                    <SelectItem value="no-domains" disabled>
                      No domains available
                    </SelectItem>
                  ) : (
                    domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {domainError && <p className="text-sm text-red-500">{domainError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select 
                onValueChange={(value) => {
                  setCategoryId(value);
                  setCategoryError('');
                }}
                disabled={!domainId}
              >
                <SelectTrigger className={categoryError ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <SelectItem value="no-categories" disabled>
                      {domainId ? 'No categories for this domain' : 'Select a domain first'}
                    </SelectItem>
                  ) : (
                    filteredCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {categoryError && <p className="text-sm text-red-500">{categoryError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-title">Question</Label>
              <Input
                id="question-title"
                placeholder="Enter your question here"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError('');
                }}
                className={titleError ? 'border-red-500' : ''}
              />
              {titleError && <p className="text-sm text-red-500">{titleError}</p>}
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Options</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </div>
              
              {optionsError && <p className="text-sm text-red-500">{optionsError}</p>}
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className={optionsError && !option.trim() ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={correctOptionIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCorrectOptionIndex(index);
                        setCorrectOptionError('');
                      }}
                    >
                      {correctOptionIndex === index ? "Correct" : "Mark Correct"}
                    </Button>
                  </div>
                ))}
              </div>
              {correctOptionError && <p className="text-sm text-red-500">{correctOptionError}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Question'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestion;