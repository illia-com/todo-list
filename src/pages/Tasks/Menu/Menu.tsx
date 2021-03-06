import CloseIcon from '@mui/icons-material/Close'
import {
	Box,
	Button,
	Grid,
	IconButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { FC, memo, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import ListIcon from './entypoList.svg'
import './Menu.sass'

// firebase
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import { UserAuth } from '../../../core/context/AuthContext'
import MotionDiv from '../../../components/Smart/MotionDiv'

const colors: string[] = [
	'rgba(66, 184, 131, 1)',
	'rgba(100, 196, 237, 1)',
	'rgba(255, 187, 204, 1)',
	'rgba(82, 82, 82, 1)',
	'rgba(195, 85, 245, 1)',
	'rgba(255, 100, 100, 1)',
]

interface MenuType {
	addNewFolder: (userId: string, name: string, color: string) => void
	activeFolder: string
	buttonSetActiveFolder: (folderProp: string) => void
	menuBurger: boolean
	setMenuBurger: (menuBurger: boolean) => void
}

const Menu: FC<MenuType> = ({
	addNewFolder,
	activeFolder,
	buttonSetActiveFolder,
	menuBurger,
	setMenuBurger,
}) => {
	const { user } = UserAuth()
	const db = getDatabase()
	// useState
	const [valueFolderName, setValueFolderName] = useState('')
	const [valueFolderColor, setValueFolderColor] = useState('')
	const [menu, setMenu] = useState<string[]>([])
	const [allTasks] = useState({
		name: 'All tasks',
		active: false,
	})

	// Getting folders
	useEffect(() => {
		const getFolder = ref(db, `${user.uid}/folder`)
		onValue(getFolder, snapshot => {
			let folderArray: any[] = []
			snapshot.forEach(data => {
				folderArray.push({
					id: data.key,
					name: data.val().folder_name,
					color: data.val().folder_color,
				})
			})
			setMenu(folderArray)
		})
	}, [db, user])

	// Functions for creating new folders
	const handleChangeFoldser = (e: {
		preventDefault: () => void
		target: { value: string }
	}) => {
		e.preventDefault()
		if (e.target.value.length <= 16) setValueFolderName(e.target.value)
	}

	const pushFolder = () => {
		if (valueFolderName.length >= 1 && valueFolderName !== ' ') {
			addNewFolder(user.uid, valueFolderName, valueFolderColor)
			setValueFolderName('')
			setValueFolderColor('')
		}
	}

	// Delete folder
	const DeleteFolder = async (menuId: string) => {
		const getFolder = await ref(db, `${user.uid}/folder/${menuId}`)
		await remove(getFolder)
		await buttonSetActiveFolder('All tasks')
	}

	return (
		<Grid
			item
			xs={menuBurger === true ? 12 : 0}
			sm={menuBurger === true ? 8 : 0}
			md={3.5}
			p={6}
			sx={{
				backgroundColor: '#F4F6F8',
				borderRadius: '20px',
				display: { xs: menuBurger === true ? 'block' : 'none', md: 'block' },
				overflowY: 'auto',
				height: { xs: '100vh', md: '85vh' },
			}}
		>
			<Stack my={4}>
				<MotionDiv variant='vX' PX={-50}>
					<Button
						onClick={() => buttonSetActiveFolder(`${allTasks.name}`)}
						variant='text'
						style={{
							color: allTasks.name === activeFolder ? '#FFFFFF' : 'none',
							justifyContent: 'flex-start',
							padding: '17px 13px',
							width: '100%',
						}}
					>
						<img src={ListIcon} alt='Menu' />
						<Typography color='primary' variant='button' ml={3}>
							{allTasks.name}
						</Typography>
					</Button>
				</MotionDiv>
				{menu.length > 0 && (
					<MotionDiv variant='vY' PX={50}>
						<Stack
							direction='column'
							alignItems='flex-start'
							spacing={2}
							my={5}
						>
							{menu.map((menuItem: any) => (
								<Box
									onClick={() => {
										buttonSetActiveFolder(`${menuItem.name}`)
										setMenuBurger(false)
									}}
									key={v4()}
									className={
										menuItem.name === activeFolder ? 'items_active' : 'items'
									}
									style={{
										backgroundColor:
											menuItem.name === activeFolder ? '#FFFFFF' : 'none',
										color: menuItem.name === activeFolder ? '#FFFFFF' : 'none',
										width: '100%',
									}}
								>
									<Grid
										container
										direction='row'
										py={1}
										px={3}
										alignItems='center'
										sx={{ cursor: 'pointer' }}
									>
										<Grid item xs={1.3} alignItems='center'>
											<Box
												sx={{
													width: '10px',
													height: '10px',
													borderRadius: '50%',
													backgroundColor: `${menuItem.color}`,
												}}
											/>
										</Grid>
										<Grid
											item
											xs={9}
											alignItems='center'
											justifyContent='flex-start'
											textAlign='left'
										>
											<Typography color='primary' variant='button' align='left'>
												{menuItem.name}
											</Typography>
										</Grid>
										<Grid item xs={1}>
											<IconButton
												aria-label='delete'
												onClick={() => DeleteFolder(menuItem.id)}
											>
												<CloseIcon
													sx={{
														color: 'rgba(180, 180, 180, 1)',
														width: '16px',
														height: '15px',
													}}
												/>
											</IconButton>
										</Grid>
									</Grid>
								</Box>
							))}
						</Stack>
					</MotionDiv>
				)}
				<MotionDiv variant='vY' PX={100}>
					<Stack direction='column' alignItems='flex-start' spacing={2} mt={5}>
						<TextField
							onKeyDown={e => (e.key === 'Enter' ? pushFolder() : null)}
							type='text'
							value={valueFolderName}
							onChange={handleChangeFoldser}
							className='list'
							id='outlined-basic'
							label='Folder name'
							variant='outlined'
							fullWidth
							sx={{
								background: '#FFFFFF',
								boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
							}}
							disabled={menu.length >= 8 ? true : false}
						/>
						<Grid
							container
							direction='row'
							alignItems='center'
							justifyContent='center'
							py={2}
						>
							{colors.map(color => (
								<Grid
									item
									key={v4()}
									xs={2}
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<IconButton
										aria-label='color'
										onClick={() => setValueFolderColor(`${color}`)}
										disabled={menu.length >= 8 ? true : false}
									>
										<Box
											sx={{
												width: '20px',
												height: '20px',
												borderRadius: '50%',
												backgroundColor: `${color}`,
												boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
											}}
										/>
									</IconButton>
								</Grid>
							))}
						</Grid>
						<Button
							onClick={pushFolder}
							color='secondary'
							style={{
								background:
									menu.length >= 8
										? 'rgba(180, 180, 180, 1)'
										: 'rgba(77, 213, 153, 1)',
								boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
								border: '0px',
								borderRadius: '4px',
								padding: '13px',
								width: '100%',
							}}
							disabled={menu.length >= 8 ? true : false}
						>
							<Typography
								sx={{ fontWeight: '600', color: 'white' }}
								variant='button'
							>
								Add
							</Typography>
						</Button>
					</Stack>
				</MotionDiv>
			</Stack>
		</Grid>
	)
}

export default memo(Menu)
