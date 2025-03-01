import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  fetchDomains, 
  deleteDomain, 
  updateDomain 
} from '../redux/slices/domainSlice';
import { 
  fetchCategories, 
  deleteCategory, 
  updateCategory 
} from '../redux/slices/categorySlice';
import { 
  fetchQuestions, 
  deleteQuestion, 
  updateQuestion 
} from '../redux/slices/questionSlice';
import { Domain, Category, Question } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Collapsible, CollapsibleContent, } from '../components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '../components/ui/dialog';
import { Search, ChevronDown, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {

  const dispatch = useAppDispatch();
  const { domains } = useAppSelector(state => state.domains);
  const { categories } = useAppSelector(state => state.categories);
  const { questions } = useAppSelector(state => state.questions);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Edit state
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  
  // Delete confirmation state
  const [deletingDomain, setDeletingDomain] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchDomains());
    dispatch(fetchCategories());
    dispatch(fetchQuestions());
  }, [dispatch]);
  
  // Filtering logic
  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle expanded state for domains and categories
  const toggleDomain = (domainId: string) => {
    if (expandedDomains.includes(domainId)) {
      setExpandedDomains(expandedDomains.filter(id => id !== domainId));
    } else {
      setExpandedDomains([...expandedDomains, domainId]);
    }
  };
  
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };
  
  // Handle domain edit
  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setEditName(domain.name);
  };
  
  const saveDomainEdit = async () => {
    if (editingDomain && editName.trim()) {
      try {
        await dispatch(updateDomain({
          ...editingDomain,
          name: editName.trim()
        })).unwrap();
        
        toast('Success', {
          description: 'Domain updated successfully!',
        });
        
        setEditingDomain(null);
        setEditName('');
      } catch (error) {
        toast('Error', {
          description: 'Failed to update domain. Please try again.',
        });
      }
    }
  };
  
  // Handle category edit
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };
  
  const saveCategoryEdit = async () => {
    if (editingCategory && editName.trim()) {
      try {
        await dispatch(updateCategory({
          ...editingCategory,
          name: editName.trim()
        })).unwrap();
        
        toast('Success', {
          description: 'Category updated successfully!',
        });
        
        setEditingCategory(null);
        setEditName('');
      } catch (error) {
        toast('Error', {
          description: 'Failed to update category. Please try again.',
        });
      }
    }
  };
  
  // Handle question edit
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setEditTitle(question.title);
  };
  
  const saveQuestionEdit = async () => {
    if (editingQuestion && editTitle.trim()) {
      try {
        await dispatch(updateQuestion({
          ...editingQuestion,
          title: editTitle.trim()
        })).unwrap();
        
        toast('Success', {
          description: 'Question updated successfully!',
        });
        
        setEditingQuestion(null);
        setEditTitle('');
      } catch (error) {
        toast('Error', {
          description: 'Failed to update question. Please try again.',
        });
      }
    }
  };
  
  // Handle delete operations
  const confirmDeleteDomain = (domainId: string) => {
    setDeletingDomain(domainId);
  };
  
  const handleDeleteDomain = async () => {
    if (deletingDomain) {
      try {
        await dispatch(deleteDomain(deletingDomain)).unwrap();
        
        // Also remove related categories and questions from state
        const relatedCategories = categories.filter(c => c.domainId === deletingDomain);
        relatedCategories.forEach(category => {
          // Delete questions in this category
          questions.filter(q => q.categoryId === category.id).forEach(question => {
            dispatch(deleteQuestion(question.id));
          });
          
          // Delete the category
          dispatch(deleteCategory(category.id));
        });
        
        toast('Success', {
          description: 'Domain deleted successfully!',
        });
        
        setDeletingDomain(null);
      } catch (error) {
        toast('Error', {
          description: 'Failed to delete domain. Please try again.',
        });
      }
    }
  };
  
  const confirmDeleteCategory = (categoryId: string) => {
    setDeletingCategory(categoryId);
  };
  
  const handleDeleteCategory = async () => {
    if (deletingCategory) {
      try {
        await dispatch(deleteCategory(deletingCategory)).unwrap();
        
        // Also remove related questions from state
        questions.filter(q => q.categoryId === deletingCategory).forEach(question => {
          dispatch(deleteQuestion(question.id));
        });
        
        toast('Success', {
          description: 'Category deleted successfully!',
        });
        
        setDeletingCategory(null);
      } catch (error) {
        toast('Error', {
          description: 'Failed to delete category. Please try again.',
        });
      }
    }
  };
  
  const confirmDeleteQuestion = (questionId: string) => {
    setDeletingQuestion(questionId);
  };
  
  const handleDeleteQuestion = async () => {
    if (deletingQuestion) {
      try {
        await dispatch(deleteQuestion(deletingQuestion)).unwrap();
        
        toast('Success', {
          description: 'Question deleted successfully!',
        });
        
        setDeletingQuestion(null);
      } catch (error) {
        toast('Error', {
          description: 'Failed to delete question. Please try again.',
        });
      }
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <div className="relative w-64">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        
        </div>
      </div>
      
      {filteredDomains.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No domains found. Create your first domain!</p>
          </CardContent>
        </Card>
      ) : (
        filteredDomains.map(domain => {
          const domainCategories = categories.filter(category => 
            category.domainId === domain.id
          );
          
          return (
            <Card key={domain.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 mr-2"
                      onClick={() => toggleDomain(domain.id)}
                    >
                      {expandedDomains.includes(domain.id) 
                        ? <ChevronDown className="h-5 w-5" /> 
                        : <ChevronRight className="h-5 w-5" />
                      }
                    </Button>
                    <CardTitle className="text-xl">{domain.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditDomain(domain)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => confirmDeleteDomain(domain.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <Collapsible open={expandedDomains.includes(domain.id)}>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    {domainCategories.length === 0 ? (
                      <p className="p-4 text-center text-muted-foreground">No categories in this domain.</p>
                    ) : (
                      <div className="divide-y">
                        {domainCategories.map(category => {
                          const categoryQuestions = questions.filter(
                            question => question.categoryId === category.id
                          );
                          
                          return (
                            <div key={category.id} className="p-2 pl-6">
                              <div className="flex justify-between items-center p-2">
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 mr-2"
                                    onClick={() => toggleCategory(category.id)}
                                  >
                                    {expandedCategories.includes(category.id) 
                                      ? <ChevronDown className="h-4 w-4" /> 
                                      : <ChevronRight className="h-4 w-4" />
                                    }
                                  </Button>
                                  <h3 className="font-medium">{category.name}</h3>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => confirmDeleteCategory(category.id)}>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              
                              <Collapsible open={expandedCategories.includes(category.id)}>
                                <CollapsibleContent>
                                  {categoryQuestions.length === 0 ? (
                                    <p className="p-4 text-center text-muted-foreground">No questions in this category.</p>
                                  ) : (
                                    <div className="space-y-2 p-2 ml-4">
                                      {categoryQuestions.map(question => (
                                        <Card key={question.id} className="p-3">
                                          <div className="flex justify-between items-center">
                                            <h4 className="font-medium">{question.title}</h4>
                                            <div className="flex space-x-2">
                                              <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                                                <Edit2 className="h-4 w-4 mr-1" />
                                                Edit
                                              </Button>
                                              <Button variant="outline" size="sm" onClick={() => confirmDeleteQuestion(question.id)}>
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="mt-2 grid grid-cols-2 gap-2">
                                            {question.options.map(option => (
                                              <div 
                                                key={option.id} 
                                                className={`p-2 border rounded ${
                                                  option.id === question.correctAnswerId ? 'bg-green-50 border-green-300' : ''
                                                }`}
                                              >
                                                {option.text}
                                                {option.id === question.correctAnswerId && 
                                                  <span className="ml-2 text-green-600">(Correct)</span>
                                                }
                                              </div>
                                            ))}
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })
      )}
      
      {/* Edit Domain Dialog */}
      <Dialog open={!!editingDomain} onOpenChange={(open) => !open && setEditingDomain(null)}>
     
      <DialogContent className="sm:max-w-md " style={{backgroundColor: "white"}}>
          <DialogHeader>
            <DialogTitle>Edit Domain</DialogTitle>
            <DialogDescription>
              Update the domain name. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Domain name"
              className="w-full"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setEditingDomain(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={saveDomainEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Category name"
              className="w-full"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={saveCategoryEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update the question title. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Question title"
              className="w-full"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={saveQuestionEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Domain Confirmation Dialog */}
      <Dialog open={!!deletingDomain} onOpenChange={(open) => !open && setDeletingDomain(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Domain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this domain? This action cannot be undone and will also delete all associated categories and questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setDeletingDomain(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="outline" onClick={handleDeleteDomain}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone and will also delete all associated questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setDeletingCategory(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="outline" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Question Confirmation Dialog */}
      <Dialog open={!!deletingQuestion} onOpenChange={(open) => !open && setDeletingQuestion(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setDeletingQuestion(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="outline" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;