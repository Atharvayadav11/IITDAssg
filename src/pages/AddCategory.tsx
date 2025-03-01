// src/pages/AddCategory.tsx
import {toast} from 'sonner'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDomains } from '../redux/slices/domainSlice';
import { addCategory } from '../redux/slices/categorySlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';


const AddCategory: React.FC = () => {
  const [name, setName] = useState('');
  const [domainId, setDomainId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');
  const [domainError, setDomainError] = useState('');
  
  const { domains } = useAppSelector(state => state.domains);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
 
  
  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Category name is required');
      isValid = false;
    }
    
    if (!domainId) {
      setDomainError('Please select a domain');
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(addCategory({ name: name.trim(), domainId })).unwrap();
      toast('Success', {
        description: 'Category created successfully!',
      });
      
      navigate('/');
    } catch (error) {
        toast('Error', {
            description: 'Failed to create category. Please try again.',
           
          });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>
            Create a new category under a domain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain-select">Domain</Label>
              <Select 
                onValueChange={(value) => {
                  setDomainId(value);
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
              {domains.length === 0 && (
                <p className="text-sm text-amber-600">
                  You need to create a domain first. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/add-domain')}>Create one now</Button>
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Frontend, Backend"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                className={nameError ? 'border-red-500' : ''}
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || domains.length === 0}
              >
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;