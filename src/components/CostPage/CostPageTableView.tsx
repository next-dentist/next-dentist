'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCostPageTable,
  useCostPageTableById,
  useTableSets,
} from '@/hooks/cost/useCostPageTable';
import { FolderPlus, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Drawer from '../Drawer';
import CostTableForm from './CostTableForm';
import CostTableSetManager from './CostTableSetForm';
interface CostPageTableViewProps {
  costPageId: string;
}

export default function CostPageTableView({
  costPageId,
}: CostPageTableViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedTableSet, setSelectedTableSet] = useState<string | null>(null);
  const [isNewTableSetDialogOpen, setIsNewTableSetDialogOpen] = useState(false);
  const [newTableSetName, setNewTableSetName] = useState('');
  const [newTableSetSlug, setNewTableSetSlug] = useState('');
  const [activeTab, setActiveTab] = useState<string>('default');
  const [isTableSetManagerDialogOpen, setIsTableSetManagerDialogOpen] =
    useState(false);

  const {
    data: costTables,
    isLoading: isLoadingTables,
    refetch: refetchTables,
  } = useCostPageTableById(costPageId);

  const {
    data: tableSets,
    isLoading: isLoadingTableSets,
    refetch: refetchTableSets,
  } = useTableSets(costPageId);

  const {
    delete: deleteTable,
    isDeleting,
    createTableSet,
  } = useCostPageTable(costPageId);

  // Update active tab when table sets change
  useEffect(() => {
    if (tableSets && tableSets.length > 0) {
      // If we're on the default tab, stay there
      if (activeTab === 'default') return;

      // If the current active tab is no longer valid, switch to the first table set
      const currentTabExists = tableSets.some(set => set.id === activeTab);
      if (!currentTabExists) {
        setActiveTab(tableSets[0].id);
      }
    }
  }, [tableSets, activeTab]);

  // Update selectedTableSet when activeTab changes
  useEffect(() => {
    setSelectedTableSet(activeTab === 'default' ? null : activeTab);
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTable(id);
      toast.success('Cost table deleted successfully');
      refetchTables();
    } catch (error) {
      console.error('Error deleting cost table:', error);
      toast.error('Failed to delete cost table');
    }
  };

  const handleEdit = (id: string) => {
    setSelectedTable(id);
    const table = costTables?.find(t => t.id === id);
    if (table) {
      setSelectedTableSet(table.tableSetId || null);
    }
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 0);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedTable(null);
    }, 100);
  };

  const handleAddNew = (tableSetId: string) => {
    setSelectedTable(null);
    setSelectedTableSet(tableSetId === 'default' ? null : tableSetId);
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 0);
  };

  const handleCreateTableSet = async () => {
    try {
      // Save before clearing fields
      const createdName = newTableSetName;
      const createdSlug = newTableSetSlug;
      await createTableSet({
        name: createdName,
        slug: createdSlug,
        costPageId,
      });

      toast.success('Table set created successfully');
      setIsNewTableSetDialogOpen(false);
      setNewTableSetName('');
      setNewTableSetSlug('');

      // Refetch table sets
      const { data: updatedTableSets } = await refetchTableSets();

      // Find the newly created table set in the updated data
      const newTableSet = updatedTableSets?.find(
        set => set.name === createdName
      );
      if (newTableSet) {
        setActiveTab(newTableSet.id);
      }
    } catch (error) {
      console.error('Error creating table set:', error);
      toast.error('Failed to create table set');
    }
  };

  if (isLoadingTables || isLoadingTableSets) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  const selectedTableData = selectedTable
    ? costTables?.find(table => table.id === selectedTable)
    : null;

  // Group tables by tableSetId
  const groupedTables = costTables?.reduce(
    (acc, table) => {
      const tableSetId = table.tableSetId || 'default';
      if (!acc[tableSetId]) {
        acc[tableSetId] = [];
      }
      acc[tableSetId].push(table);
      return acc;
    },
    {} as Record<string, typeof costTables>
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Cost Tables</CardTitle>
        <Dialog
          open={isTableSetManagerDialogOpen}
          onOpenChange={setIsTableSetManagerDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Manage Table Sets
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Table Sets</DialogTitle>
            </DialogHeader>
            <CostTableSetManager costPageId={costPageId} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isNewTableSetDialogOpen}
          onOpenChange={setIsNewTableSetDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Table Set
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table Set</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tableSetName">Table Set Name</Label>
                <Input
                  id="tableSetName"
                  value={newTableSetName}
                  onChange={e => setNewTableSetName(e.target.value)}
                  placeholder="Enter table set name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableSetSlug">Table Set Slug</Label>
                <Input
                  id="tableSetSlug"
                  value={newTableSetSlug}
                  onChange={e => setNewTableSetSlug(e.target.value)}
                  placeholder="Enter table set slug"
                />
              </div>
              <Button
                onClick={handleCreateTableSet}
                className="w-full"
                disabled={!newTableSetName || !newTableSetSlug}
              >
                Create Table Set
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          title={selectedTable ? 'Edit Cost Table' : 'Add New Cost Table'}
          side="right"
          width="w-[80%]"
        >
          <CostTableForm
            key={selectedTable || 'new'}
            costPageId={costPageId}
            selectedTable={selectedTableData}
            tableSetId={selectedTableSet}
            isDrawerOpen={isDrawerOpen}
            onSubmit={() => {
              handleDrawerClose();
              refetchTables();
            }}
          />
        </Drawer>

        <Tabs
          defaultValue="default"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="default">Default Set</TabsTrigger>
            {tableSets?.map(tableSet => (
              <TabsTrigger key={tableSet.id} value={tableSet.id}>
                {tableSet.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="default" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Default Set</h3>
              <Button onClick={() => handleAddNew('default')}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Row
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Cost One</TableHead>
                    <TableHead>Cost Two</TableHead>
                    <TableHead>Cost Three</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedTables?.['default']?.map(table => (
                    <TableRow key={table.id}>
                      <TableCell>
                        {table.image ? (
                          <img
                            src={table.image}
                            alt={table.imageAlt || 'Table Image'}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          'No Image'
                        )}
                      </TableCell>
                      <TableCell>{table.costOne}</TableCell>
                      <TableCell>{table.costTwo}</TableCell>
                      <TableCell>{table.costThree}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(table.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(table.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {tableSets?.map(tableSet => (
            <TabsContent
              key={tableSet.id}
              value={tableSet.id}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tableSet.name}</h3>
                <Button onClick={() => handleAddNew(tableSet.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Row
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Cost One</TableHead>
                      <TableHead>Cost Two</TableHead>
                      <TableHead>Cost Three</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedTables?.[tableSet.id]?.map(table => (
                      <TableRow key={table.id}>
                        <TableCell>
                          {table.image ? (
                            <Image
                              src={table.image}
                              alt={table.imageAlt || 'Table Image'}
                              className="h-10 w-10 object-cover"
                              width={64}
                              height={64}
                            />
                          ) : (
                            'No Image'
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {table.title}
                        </TableCell>
                        <TableCell>{table.costOne}</TableCell>
                        <TableCell>{table.costTwo}</TableCell>
                        <TableCell>{table.costThree}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(table.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(table.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
