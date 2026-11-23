import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/utils';
import { olTimetable, alTimetable, OLTimeTable, ALTimeTable } from '@/data/mockData';

const TimetableManager = () => {
  const [activeTimetableTab, setActiveTimetableTab] = useState('ol');
  const [olTimetables, setOlTimetables] = useState<OLTimeTable[]>(olTimetable);
  const [alTimetables, setAlTimetables] = useState<ALTimeTable[]>(alTimetable);
  const [editingBranchIndex, setEditingBranchIndex] = useState<number | null>(null);
  const [editingClassIndex, setEditingClassIndex] = useState<number | null>(null);
  const [isEditingAL, setIsEditingAL] = useState(false);
  
  // Form states
  const [olFormData, setOlFormData] = useState({
    branch: '',
    grade10Time: '',
    grade10Group: '',
    grade11Time: '',
    grade11Group: ''
  });

  const [alFormData, setAlFormData] = useState({
    branch: '',
    year: '',
    type: 'Theory',
    time: ''
  });
  const [isCustomYear, setIsCustomYear] = useState(false);

  useEffect(() => {
    // Load timetables from backend on component mount
    loadTimetables();
  }, []);

  const loadTimetables = async () => {
    try {
      // Load O/L timetable
      const olResponse = await apiFetch('TimetableServlet?action=getOLTimetable', {
        credentials: 'include'
      });
      
      if (olResponse.ok) {
        const olData = await olResponse.json();
        if (olData.length > 0) {
          setOlTimetables(olData);
        }
      }

      // Load A/L timetable
      const alResponse = await apiFetch('TimetableServlet?action=getALTimetable', {
        credentials: 'include'
      });
      
      if (alResponse.ok) {
        const alData = await alResponse.json();
        if (alData.length > 0) {
          setAlTimetables(alData);
        }
      }
    } catch (error) {
      console.error('Error loading timetables:', error);
    }
  };

  const saveTimetables = async () => {
    try {
      if (activeTimetableTab === 'ol') {
        const response = await apiFetch('TimetableServlet?action=saveOLTimetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            timetableData: JSON.stringify(olTimetables)
          }).toString(),
          credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
          toast.success('O/L timetable saved successfully');
        } else {
          toast.error(data.error || 'Failed to save O/L timetable');
        }
      } else {
        const response = await apiFetch('TimetableServlet?action=saveALTimetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            timetableData: JSON.stringify(alTimetables)
          }).toString(),
          credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
          toast.success('A/L timetable saved successfully');
        } else {
          toast.error(data.error || 'Failed to save A/L timetable');
        }
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error('Failed to save timetable');
    }
  };

  const addOLBranch = () => {
    if (!olFormData.branch.trim()) {
      toast.error('Please enter a branch name');
      return;
    }

    const newBranch: OLTimeTable = {
      branch: olFormData.branch,
      grade10: [{
        location: olFormData.branch,
        grade: 'Grade 10',
        time: olFormData.grade10Time || '9:00 AM - 11:00 AM',
        group: olFormData.grade10Group || 'Group 1'
      }],
      grade11: [{
        location: olFormData.branch,
        grade: 'Grade 11',
        time: olFormData.grade11Time || '2:00 PM - 4:00 PM',
        group: olFormData.grade11Group || 'Group 1'
      }]
    };

    setOlTimetables([...olTimetables, newBranch]);
    setOlFormData({
      branch: '',
      grade10Time: '',
      grade10Group: '',
      grade11Time: '',
      grade11Group: ''
    });
    toast.success('Branch added successfully');
  };

  const addALClass = () => {
    if (!alFormData.branch.trim() || !alFormData.time.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    const newClass: ALTimeTable = {
      branch: alFormData.branch,
      year: alFormData.year || '2026',
      type: alFormData.type,
      time: alFormData.time
    };

    setAlTimetables([...alTimetables, newClass]);
    setAlFormData({
      branch: '',
      year: '',
      type: 'Theory',
      time: ''
    });
    setIsCustomYear(false);
    toast.success('Class added successfully');
  };

  const removeOLBranch = (index: number) => {
    const newTimetables = [...olTimetables];
    newTimetables.splice(index, 1);
    setOlTimetables(newTimetables);
    toast.success('Branch removed');
  };

  const removeOLClass = (branchIndex: number, grade: 'grade10' | 'grade11', classIndex: number) => {
    const newTimetables = [...olTimetables];
    newTimetables[branchIndex][grade].splice(classIndex, 1);
    
    // If both grade arrays are empty, remove the branch
    if (newTimetables[branchIndex].grade10.length === 0 && 
        newTimetables[branchIndex].grade11.length === 0) {
      newTimetables.splice(branchIndex, 1);
    }
    
    setOlTimetables(newTimetables);
    toast.success('Class removed');
  };

  const removeALClass = (index: number) => {
    const newTimetables = [...alTimetables];
    newTimetables.splice(index, 1);
    setAlTimetables(newTimetables);
    toast.success('Class removed');
  };

  const startEditOLClass = (branchIndex: number, grade: 'grade10' | 'grade11', classIndex: number) => {
    setEditingBranchIndex(branchIndex);
    setEditingClassIndex(classIndex);
    
    const timetable = olTimetables[branchIndex];
    const classItem = timetable[grade][classIndex];
    
    setOlFormData({
      branch: timetable.branch,
      grade10Time: grade === 'grade10' ? classItem.time : '',
      grade10Group: grade === 'grade10' ? classItem.group || '' : '',
      grade11Time: grade === 'grade11' ? classItem.time : '',
      grade11Group: grade === 'grade11' ? classItem.group || '' : '',
    });
  };

  const saveEditOLClass = () => {
    if (editingBranchIndex === null || editingClassIndex === null) return;
    
    // Determine which grade is being edited
    const grade = olFormData.grade10Time ? 'grade10' : 'grade11';
    
    const newTimetables = [...olTimetables];
    const classItem = newTimetables[editingBranchIndex][grade][editingClassIndex];
    
    if (grade === 'grade10') {
      classItem.time = olFormData.grade10Time;
      classItem.group = olFormData.grade10Group || undefined;
    } else {
      classItem.time = olFormData.grade11Time;
      classItem.group = olFormData.grade11Group || undefined;
    }
    
    setOlTimetables(newTimetables);
    setEditingBranchIndex(null);
    setEditingClassIndex(null);
    setOlFormData({
      branch: '',
      grade10Time: '',
      grade10Group: '',
      grade11Time: '',
      grade11Group: ''
    });
    toast.success('Class updated successfully');
  };

  const cancelEdit = () => {
    setEditingBranchIndex(null);
    setEditingClassIndex(null);
    setIsEditingAL(false);
    setIsCustomYear(false);
    setOlFormData({
      branch: '',
      grade10Time: '',
      grade10Group: '',
      grade11Time: '',
      grade11Group: ''
    });
    setAlFormData({
      branch: '',
      year: '',
      type: 'Theory',
      time: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timetable Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadTimetables}>
            Reload
          </Button>
          <Button onClick={saveTimetables}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTimetableTab} onValueChange={setActiveTimetableTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="ol">O/L Timetable</TabsTrigger>
          <TabsTrigger value="al">A/L Timetable</TabsTrigger>
        </TabsList>

        {/* O/L Timetable Tab */}
        <TabsContent value="ol">
          <Card>
            <CardHeader>
              <CardTitle>O/L Timetable Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Branch Form */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">
                  {editingBranchIndex !== null ? 'Edit Class' : 'Add New Branch'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branch">Branch Name *</Label>
                    <Input
                      id="branch"
                      value={olFormData.branch}
                      onChange={(e) => setOlFormData({...olFormData, branch: e.target.value})}
                      placeholder="e.g., OVIDMA - MAHARAGAMA"
                    />
                  </div>
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-3 rounded">
                      <h4 className="font-medium mb-2">Grade 10</h4>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="grade10Time">Time</Label>
                          <Input
                            id="grade10Time"
                            value={olFormData.grade10Time}
                            onChange={(e) => setOlFormData({...olFormData, grade10Time: e.target.value})}
                            placeholder="e.g., Wednesday 3.30PM - 5.30PM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade10Group">Group (Optional)</Label>
                          <Input
                            id="grade10Group"
                            value={olFormData.grade10Group}
                            onChange={(e) => setOlFormData({...olFormData, grade10Group: e.target.value})}
                            placeholder="e.g., Group 1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border p-3 rounded">
                      <h4 className="font-medium mb-2">Grade 11</h4>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="grade11Time">Time</Label>
                          <Input
                            id="grade11Time"
                            value={olFormData.grade11Time}
                            onChange={(e) => setOlFormData({...olFormData, grade11Time: e.target.value})}
                            placeholder="e.g., Saturday 8.00AM - 10.00AM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade11Group">Group (Optional)</Label>
                          <Input
                            id="grade11Group"
                            value={olFormData.grade11Group}
                            onChange={(e) => setOlFormData({...olFormData, grade11Group: e.target.value})}
                            placeholder="e.g., Group 2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex gap-2">
                    {editingBranchIndex !== null ? (
                      <>
                        <Button onClick={saveEditOLClass}>
                          Update Class
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={addOLBranch}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Branch
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* O/L Timetable List */}
              <div className="space-y-4">
                {olTimetables.map((branch, branchIndex) => (
                  <div key={branchIndex} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-3 flex justify-between items-center">
                      <h3 className="font-semibold">{branch.branch}</h3>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeOLBranch(branchIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-green-600">Grade 10 Classes</h4>
                        {branch.grade10.length === 0 ? (
                          <p className="text-gray-500 text-sm">No Grade 10 classes</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {branch.grade10.map((item, classIndex) => (
                                <TableRow key={classIndex}>
                                  <TableCell>{item.location}</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      {item.grade}
                                    </span>
                                  </TableCell>
                                  <TableCell>{item.time}</TableCell>
                                  <TableCell>{item.group || '-'}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEditOLClass(branchIndex, 'grade10', classIndex)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeOLClass(branchIndex, 'grade10', classIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600">Grade 11 Classes</h4>
                        {branch.grade11.length === 0 ? (
                          <p className="text-gray-500 text-sm">No Grade 11 classes</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {branch.grade11.map((item, classIndex) => (
                                <TableRow key={classIndex}>
                                  <TableCell>{item.location}</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                      {item.grade}
                                    </span>
                                  </TableCell>
                                  <TableCell>{item.time}</TableCell>
                                  <TableCell>{item.group || '-'}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEditOLClass(branchIndex, 'grade11', classIndex)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeOLClass(branchIndex, 'grade11', classIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/L Timetable Tab */}
        <TabsContent value="al">
          <Card>
            <CardHeader>
              <CardTitle>A/L Timetable Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New A/L Class Form */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Add New A/L Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="alBranch">Branch *</Label>
                    <Input
                      id="alBranch"
                      value={alFormData.branch}
                      onChange={(e) => setAlFormData({...alFormData, branch: e.target.value})}
                      placeholder="e.g., SESIRA - PILIYANDALA"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alYear">Year *</Label>
                    {isCustomYear ? (
                      <Input
                        id="alYear"
                        value={alFormData.year}
                        onChange={(e) => setAlFormData({...alFormData, year: e.target.value})}
                        placeholder="Enter year (e.g., 2028)"
                      />
                    ) : (
                      <Select 
                        value={alFormData.year} 
                        onValueChange={(value) => {
                          if (value === 'custom') {
                            setIsCustomYear(true);
                            setAlFormData({...alFormData, year: ''});
                          } else {
                            setAlFormData({...alFormData, year: value});
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2026">2026 Batch</SelectItem>
                          <SelectItem value="2027">2027 Batch</SelectItem>
                          <SelectItem value="Grade 11">Grade 11</SelectItem>
                          <SelectItem value="custom">+ Add Custom Year</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {isCustomYear && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-xs"
                        onClick={() => {
                          setIsCustomYear(false);
                          setAlFormData({...alFormData, year: ''});
                        }}
                      >
                        Use preset options
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="alType">Class Type *</Label>
                    <Select 
                      value={alFormData.type} 
                      onValueChange={(value) => setAlFormData({...alFormData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Revision + Paper">Revision + Paper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="alTime">Time *</Label>
                    <Input
                      id="alTime"
                      value={alFormData.time}
                      onChange={(e) => setAlFormData({...alFormData, time: e.target.value})}
                      placeholder="e.g., Saturday 1.00PM - 3.00PM"
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <Button onClick={addALClass}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add A/L Class
                    </Button>
                  </div>
                </div>
              </div>

              {/* A/L Timetable List */}
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alTimetables.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.branch}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.year === '2026' || item.year === '2027' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.year}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.type === 'Theory' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.type}
                          </span>
                        </TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeALClass(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Make changes to the timetables above</li>
            <li>Click "Save All Changes" to persist changes to the database</li>
            <li>Changes will reflect on the main website timetable page</li>
            <li>Use the reload button to restore original data if needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableManager;